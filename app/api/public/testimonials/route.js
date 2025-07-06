import clientPromise from '../../../../lib/mongodb';

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db();
    
    // Get all testimonials, sorted by creation date (newest first)
    const testimonials = await db.collection('testimonials')
      .find({})
      .sort({ _id: -1 }) // Sort by ObjectId (newest first)
      .toArray();
    
    return new Response(JSON.stringify(testimonials), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error fetching testimonials:', error);
    return new Response(JSON.stringify({ error: 'Failed to fetch testimonials' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
} 