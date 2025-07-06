import clientPromise from '@/lib/mongodb';

// GET: Fetch all services
export async function GET() {
  const client = await clientPromise;
  const db = client.db();
  const services = await db.collection('services').find({}).toArray();
  return new Response(JSON.stringify(services), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
}

// POST: Create a new service
export async function POST(req) {
  const body = await req.json();
  const client = await clientPromise;
  const db = client.db();
  const result = await db.collection('services').insertOne(body);
  return new Response(JSON.stringify({ insertedId: result.insertedId }), {
    status: 201,
    headers: { 'Content-Type': 'application/json' },
  });
}
