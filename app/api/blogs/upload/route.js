import { writeFile } from 'fs/promises';
import path from 'path';
import clientPromise from '@/lib/mongodb';

export async function POST(req) {
  // Parse form data
  const formData = await req.formData();
  const title = formData.get('title');
  const description = formData.get('description');
  const file = formData.get('pdf');

  let pdfUrl = null;
  if (file && typeof file === 'object' && file.arrayBuffer) {
    const buffer = Buffer.from(await file.arrayBuffer());
    const uploadDir = path.join(process.cwd(), 'public', 'blog-pdfs');
    const fileName = `${Date.now()}-${file.name}`;
    const filePath = path.join(uploadDir, fileName);
    await writeFile(filePath, buffer);
    pdfUrl = `/blog-pdfs/${fileName}`;
  }

  const client = await clientPromise;
  const db = client.db();
  const result = await db.collection('blogs').insertOne({
    title,
    description,
    pdfUrl,
  });

  return new Response(JSON.stringify({ insertedId: result.insertedId, pdfUrl }), {
    status: 201,
    headers: { 'Content-Type': 'application/json' },
  });
}
