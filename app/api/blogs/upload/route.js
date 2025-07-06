import { put, list } from '@vercel/blob';
import clientPromise from '@/lib/mongodb';

export async function POST(req) {
  try {
    // Parse form data
    const formData = await req.formData();
    const title = formData.get('title');
    const description = formData.get('description');
    const keywords = formData.get('keywords');
    const file = formData.get('pdf');

    // Validate required fields
    if (!title || !description) {
      return new Response(JSON.stringify({ error: 'Missing required fields' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Check storage usage before upload
    try {
      if (process.env.BLOB_READ_WRITE_TOKEN) {
        const { blobs } = await list();
        const totalSize = blobs.reduce((sum, blob) => sum + blob.size, 0);
        const totalSizeGB = totalSize / (1024 * 1024 * 1024);
        
        if (totalSizeGB >= 0.9) { // Warning at 90% usage
          console.warn('Storage usage is high:', totalSizeGB.toFixed(2), 'GB');
        }
      }
    } catch (storageError) {
      console.error('Failed to check storage usage:', storageError);
    }

    let pdfUrl = null;
    let fileSize = 0;
    
    if (file && typeof file === 'object' && file.arrayBuffer) {
      try {
        // Validate file type
        if (!file.type || file.type !== 'application/pdf') {
          return new Response(JSON.stringify({ error: 'Only PDF files are allowed' }), {
            status: 400,
            headers: { 'Content-Type': 'application/json' },
          });
        }

        // Validate file size (max 8MB for blog PDFs)
        const maxSize = 8 * 1024 * 1024; // 8MB
        if (file.size > maxSize) {
          return new Response(JSON.stringify({ 
            error: 'File size must be less than 8MB. Please compress your PDF or use a smaller file.' 
          }), {
            status: 400,
            headers: { 'Content-Type': 'application/json' },
          });
        }

        fileSize = file.size;

        // Generate unique filename with timestamp and sanitized name
        const timestamp = Date.now();
        const sanitizedName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
        const fileName = `blog-pdfs/${timestamp}-${sanitizedName}`;

        // Upload to Vercel Blob with metadata
        const blob = await put(fileName, file, {
          access: 'public',
          addRandomSuffix: false, // We're already using timestamp for uniqueness
        });
        
        pdfUrl = blob.url;
        
        console.log(`Blog PDF uploaded successfully: ${fileName} (${(fileSize / 1024 / 1024).toFixed(2)}MB)`);
        
      } catch (fileError) {
        console.error('File upload error:', fileError);
        
        // Provide more specific error messages
        if (fileError.message?.includes('size')) {
          return new Response(JSON.stringify({ error: 'File is too large. Please try a smaller PDF.' }), {
            status: 400,
            headers: { 'Content-Type': 'application/json' },
          });
        }
        
        return new Response(JSON.stringify({ error: 'Failed to upload PDF file. Please try again.' }), {
          status: 500,
          headers: { 'Content-Type': 'application/json' },
        });
      }
    }

    // Parse keywords if provided
    let keywordsArray = [];
    if (keywords) {
      keywordsArray = keywords.split(',').map(k => k.trim()).filter(Boolean);
    }

    const client = await clientPromise;
    const db = client.db();
    
    const blogData = {
      title: title.trim(),
      description: description.trim(),
      keywords: keywordsArray,
      pdfUrl,
      fileSize: fileSize > 0 ? fileSize : null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await db.collection('blogs').insertOne(blogData);

    return new Response(JSON.stringify({ 
      insertedId: result.insertedId, 
      pdfUrl,
      fileSize: fileSize > 0 ? (fileSize / 1024 / 1024).toFixed(2) + 'MB' : null,
      message: 'Blog created successfully'
    }), {
      status: 201,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Blog upload error:', error);
    return new Response(JSON.stringify({ error: 'Internal server error. Please try again.' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
