import clientPromise from '../../../lib/mongodb';

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db();
    const submissions = await db
      .collection('contact_submissions')
      .find({})
      .sort({ createdAt: -1 })
      .toArray();
    return new Response(JSON.stringify(submissions), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
} 