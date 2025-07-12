import clientPromise from '../../../lib/mongodb';
import { ObjectId } from 'mongodb';

export async function POST(req) {
  try {
    const data = await req.json();
    const client = await clientPromise;
    const db = client.db();
    const submission = {
      ...data,
      createdAt: new Date(),
    };
    await db.collection('contact_submissions').insertOne(submission);
    return new Response(JSON.stringify({ success: true }), { status: 201 });
  } catch (error) {
    return new Response(JSON.stringify({ success: false, error: error.message }), { status: 500 });
  }
}

export async function GET(req) {
  const url = new URL(req.url);
  if (url.searchParams.get('all') !== '1') {
    return new Response(JSON.stringify({ error: 'Unauthorized or missing parameter.' }), { status: 400 });
  }
  try {
    const client = await clientPromise;
    const db = client.db();
    const submissions = await db.collection('contact_submissions').find({}).sort({ createdAt: -1 }).toArray();
    return new Response(JSON.stringify({ submissions }), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}

export async function PATCH(req) {
  const url = new URL(req.url);
  const id = url.searchParams.get('id');
  if (!id) {
    return new Response(JSON.stringify({ error: 'Missing id parameter.' }), { status: 400 });
  }
  try {
    const data = await req.json();
    const client = await clientPromise;
    const db = client.db();
    
    const updateData = {
      contacted: data.contacted,
      contactedAt: data.contacted ? new Date() : null
    };
    
    const result = await db.collection('contact_submissions').updateOne(
      { _id: new ObjectId(id) },
      { $set: updateData }
    );
    
    if (result.matchedCount === 1) {
      return new Response(JSON.stringify({ success: true }), { status: 200 });
    } else {
      return new Response(JSON.stringify({ error: 'Not found.' }), { status: 404 });
    }
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}

export async function DELETE(req) {
  const url = new URL(req.url);
  const id = url.searchParams.get('id');
  if (!id) {
    return new Response(JSON.stringify({ error: 'Missing id parameter.' }), { status: 400 });
  }
  try {
    const client = await clientPromise;
    const db = client.db();
    const result = await db.collection('contact_submissions').deleteOne({ _id: new ObjectId(id) });
    if (result.deletedCount === 1) {
      return new Response(JSON.stringify({ success: true }), { status: 200 });
    } else {
      return new Response(JSON.stringify({ error: 'Not found.' }), { status: 404 });
    }
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
} 