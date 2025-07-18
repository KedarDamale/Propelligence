import { put } from '@vercel/blob';
import clientPromise from '@/lib/mongodb';

export async function POST(req) {
  try {
    // Parse form data
    const formData = await req.formData();
    const title = formData.get('title');
    const short_desc = formData.get('short_desc');
    const long_desc = formData.get('long_desc');
    const file = formData.get('pdf');

    // Validate required fields
    if (!title || !short_desc || !long_desc) {
      return new Response(JSON.stringify({ error: 'Missing required fields' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    let pdfUrl = null;
    if (file && typeof file === 'object' && file.arrayBuffer) {
      try {
        // Validate file type
        if (!file.type || file.type !== 'application/pdf') {
          return new Response(JSON.stringify({ error: 'Only PDF files are allowed' }), {
            status: 400,
            headers: { 'Content-Type': 'application/json' },
          });
        }

        // Validate file size (max 10MB)
        const maxSize = 10 * 1024 * 1024; // 10MB
        if (file.size > maxSize) {
          return new Response(JSON.stringify({ error: 'File size must be less than 10MB' }), {
            status: 400,
            headers: { 'Content-Type': 'application/json' },
          });
        }

        // Upload to Vercel Blob
        const blob = await put(`service-pdfs/${Date.now()}-${file.name}`, file, {
          access: 'public',
        });
        
        pdfUrl = blob.url;
        
      } catch (fileError) {
        console.error('File upload error:', fileError);
        return new Response(JSON.stringify({ error: 'Failed to upload PDF file' }), {
          status: 500,
          headers: { 'Content-Type': 'application/json' },
        });
      }
    }

    const client = await clientPromise;
    const db = client.db();
    const result = await db.collection('services').insertOne({
      title,
      short_desc,
      long_desc,
      pdfUrl,
    });

    return new Response(JSON.stringify({ insertedId: result.insertedId, pdfUrl }), {
      status: 201,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Service upload error:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
} 