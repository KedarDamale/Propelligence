import { put, del } from '@vercel/blob';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export async function PUT(req) {
  try {
    const formData = await req.formData();
    const blogId = formData.get('blogId');
    const title = formData.get('title');
    const short_desc = formData.get('short_desc');
    const long_desc = formData.get('long_desc');
    const keywords = formData.get('keywords');
    const pdf = formData.get('pdf');
    const currentPdfUrl = formData.get('currentPdfUrl');

    if (!blogId) {
      return new Response(JSON.stringify({ error: 'Blog ID is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    if (!title || !short_desc || !long_desc) {
      return new Response(JSON.stringify({ error: 'Title, short description, and long description are required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const client = await clientPromise;
    const db = client.db();

    // Prepare update data
    const updateData = {
      title,
      short_desc,
      long_desc,
    };

    // Handle keywords if provided
    if (keywords) {
      const keywordsArray = keywords.split(',').map(k => k.trim()).filter(Boolean);
      updateData.keywords = keywordsArray;
    }

    let newPdfUrl = currentPdfUrl;

    // Handle PDF upload if a new file is provided
    if (pdf && pdf instanceof File && pdf.size > 0) {
      try {
        // Validate file type
        if (pdf.type !== 'application/pdf') {
          return new Response(JSON.stringify({ error: 'Only PDF files are allowed' }), {
            status: 400,
            headers: { 'Content-Type': 'application/json' },
          });
        }

        // Validate file size (8MB limit for blogs)
        const maxSize = 8 * 1024 * 1024; // 8MB
        if (pdf.size > maxSize) {
          return new Response(JSON.stringify({ error: 'PDF file size must be less than 8MB' }), {
            status: 400,
            headers: { 'Content-Type': 'application/json' },
          });
        }

        // Upload new PDF to blob storage
        const filename = `${Date.now()}-${pdf.name}`;
        const blob = await put(`blog-pdfs/${filename}`, pdf, {
          access: 'public',
        });

        newPdfUrl = blob.url;
        updateData.pdfUrl = newPdfUrl;

        console.log(`New PDF uploaded: ${newPdfUrl}`);

        // Delete old PDF if it exists and is different from the new one
        if (currentPdfUrl && currentPdfUrl !== newPdfUrl) {
          try {
            await del(currentPdfUrl);
            console.log(`Old PDF deleted: ${currentPdfUrl}`);
          } catch (deleteError) {
            console.error('Failed to delete old PDF:', deleteError);
            // Continue with update even if old PDF deletion fails
          }
        }
      } catch (uploadError) {
        console.error('PDF upload error:', uploadError);
        return new Response(JSON.stringify({ error: 'Failed to upload PDF' }), {
          status: 500,
          headers: { 'Content-Type': 'application/json' },
        });
      }
    }

    // Update the blog in database
    const result = await db.collection('blogs').updateOne(
      { _id: new ObjectId(blogId) },
      { $set: updateData }
    );

    if (result.matchedCount === 0) {
      return new Response(JSON.stringify({ error: 'Blog not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({ 
      message: 'Blog updated successfully',
      updated: true,
      pdfUrl: newPdfUrl
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Blog update error:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
} 