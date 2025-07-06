import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

// GET: Get a single testimonial by ID
export async function GET(req, context) {
  const params = await context.params;
  const client = await clientPromise;
  const db = client.db();
  const { id } = params;
  const testimonial = await db.collection('testimonials').findOne({ _id: new ObjectId(id) });
  if (!testimonial) {
    return new Response(JSON.stringify({ error: 'Testimonial not found' }), { status: 404 });
  }
  return new Response(JSON.stringify(testimonial), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
}

// PUT: Update a testimonial by ID
export async function PUT(req, context) {
  const params = await context.params;
  const client = await clientPromise;
  const db = client.db();
  const { id } = params;
  const body = await req.json();
  const result = await db.collection('testimonials').updateOne(
    { _id: new ObjectId(id) },
    { $set: body }
  );
  if (result.matchedCount === 0) {
    return new Response(JSON.stringify({ error: 'Testimonial not found' }), { status: 404 });
  }
  return new Response(JSON.stringify({ updated: true }), { status: 200 });
}

// DELETE: Delete a testimonial by ID
export async function DELETE(req, context) {
  const params = await context.params;
  const client = await clientPromise;
  const db = client.db();
  const { id } = params;
  const result = await db.collection('testimonials').deleteOne({ _id: new ObjectId(id) });
  if (result.deletedCount === 0) {
    return new Response(JSON.stringify({ error: 'Testimonial not found' }), { status: 404 });
  }
  return new Response(JSON.stringify({ deleted: true }), { status: 200 });
}
