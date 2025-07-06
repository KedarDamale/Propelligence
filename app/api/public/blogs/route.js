import clientPromise from '../../../../lib/mongodb';

export async function GET(req) {
  try {
    const client = await clientPromise;
    const db = client.db();
    const url = new URL(req.url);
    const sort = url.searchParams.get('sort') || 'newest';
    const search = url.searchParams.get('search') || '';
    
    // Build query for search
    const query = search
      ? {
          $or: [
            { title: { $regex: search, $options: 'i' } },
            { description: { $regex: search, $options: 'i' } },
            { keywords: { $regex: search, $options: 'i' } },
          ],
        }
      : {};
    
    // Build sort object
    const sortObj = sort === 'oldest' ? { _id: 1 } : { _id: -1 };
    
    // Get blogs with search and sorting
    const blogs = await db.collection('blogs')
      .find(query)
      .sort(sortObj)
      .toArray();
    
    return new Response(JSON.stringify(blogs), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error fetching blogs:', error);
    return new Response(JSON.stringify({ error: 'Failed to fetch blogs' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
} 