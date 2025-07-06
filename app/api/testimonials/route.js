import clientPromise from '@/lib/mongodb';

// GET: Fetch all testimonials
export async function GET() {
  const client = await clientPromise;
  const db = client.db();
  const testimonials = await db.collection('testimonials').find({}).toArray();
  return new Response(JSON.stringify(testimonials), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
}

// POST: Create a new testimonial
export async function POST(req) {
  const body = await req.json();
  const client = await clientPromise;
  const db = client.db();
  const result = await db.collection('testimonials').insertOne(body);
  return new Response(JSON.stringify({ insertedId: result.insertedId }), {
    status: 201,
    headers: { 'Content-Type': 'application/json' },
  });
}
