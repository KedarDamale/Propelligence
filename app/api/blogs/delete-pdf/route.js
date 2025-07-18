import { del } from '@vercel/blob';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export async function DELETE(req) {
  try {
    const { searchParams } = new URL(req.url);
    const blogId = searchParams.get('id');
    const pdfUrl = searchParams.get('pdfUrl');

    if (!blogId) {
      return new Response(JSON.stringify({ error: 'Blog ID is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // If PDF URL is provided, delete from blob storage
    if (pdfUrl) {
      try {
        await del(pdfUrl);
        console.log(`PDF deleted from blob storage: ${pdfUrl}`);
      } catch (blobError) {
        console.error('Failed to delete PDF from blob storage:', blobError);
        // Continue with database deletion even if blob deletion fails
      }
    }

    // Delete from database - convert string ID to ObjectId
    const client = await clientPromise;
    const db = client.db();
    const result = await db.collection('blogs').deleteOne({ _id: new ObjectId(blogId) });

    if (result.deletedCount === 0) {
      return new Response(JSON.stringify({ error: 'Blog not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({ 
      message: 'Blog and associated PDF deleted successfully',
      deletedCount: result.deletedCount
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Blog deletion error:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
} 