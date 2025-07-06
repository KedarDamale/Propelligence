import clientPromise from '@/lib/mongodb';

// GET: Fetch all blogs with optional sort and search
export async function GET(req) {
  const client = await clientPromise;
  const db = client.db();
  const url = new URL(req.url);
  const sort = url.searchParams.get('sort') || 'newest';
  const search = url.searchParams.get('search') || '';
  const query = search
    ? {
        $or: [
          { title: { $regex: search, $options: 'i' } },
          { description: { $regex: search, $options: 'i' } },
          { keywords: { $regex: search, $options: 'i' } },
        ],
      }
    : {};
  const sortObj = sort === 'oldest' ? { _id: 1 } : { _id: -1 };
  const blogs = await db.collection('blogs').find(query).sort(sortObj).toArray();
  return new Response(JSON.stringify(blogs), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
}

// POST: Create a new blog (without PDF upload)
export async function POST(req) {
  const body = await req.json();
  const client = await clientPromise;
  const db = client.db();
  const result = await db.collection('blogs').insertOne(body);
  return new Response(JSON.stringify({ insertedId: result.insertedId }), {
    status: 201,
    headers: { 'Content-Type': 'application/json' },
  });
}
