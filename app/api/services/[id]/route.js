import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

// GET: Get a single service by ID
export async function GET(req, context) {
  const params = await context.params;
  const client = await clientPromise;
  const db = client.db();
  const { id } = params;
  const service = await db.collection('services').findOne({ _id: new ObjectId(id) });
  if (!service) {
    return new Response(JSON.stringify({ error: 'Service not found' }), { status: 404 });
  }
  return new Response(JSON.stringify(service), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
}

// PUT: Update a service by ID
export async function PUT(req, context) {
  const params = await context.params;
  const client = await clientPromise;
  const db = client.db();
  const { id } = params;
  const body = await req.json();
  const result = await db.collection('services').updateOne(
    { _id: new ObjectId(id) },
    { $set: body }
  );
  if (result.matchedCount === 0) {
    return new Response(JSON.stringify({ error: 'Service not found' }), { status: 404 });
  }
  return new Response(JSON.stringify({ updated: true }), { status: 200 });
}

// DELETE: Delete a service by ID
export async function DELETE(req, context) {
  const params = await context.params;
  const client = await clientPromise;
  const db = client.db();
  const { id } = params;
  const result = await db.collection('services').deleteOne({ _id: new ObjectId(id) });
  if (result.deletedCount === 0) {
    return new Response(JSON.stringify({ error: 'Service not found' }), { status: 404 });
  }
  return new Response(JSON.stringify({ deleted: true }), { status: 200 });
}
