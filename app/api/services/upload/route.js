import { writeFile } from 'fs/promises';
import path from 'path';
import clientPromise from '@/lib/mongodb';

export async function POST(req) {
  // Parse form data
  const formData = await req.formData();
  const title = formData.get('title');
  const short_desc = formData.get('short_desc');
  const long_desc = formData.get('long_desc');
  const file = formData.get('pdf');

  let pdfUrl = null;
  if (file && typeof file === 'object' && file.arrayBuffer) {
    const buffer = Buffer.from(await file.arrayBuffer());
    const uploadDir = path.join(process.cwd(), 'public', 'service-pdfs');
    const fileName = `${Date.now()}-${file.name}`;
    const filePath = path.join(uploadDir, fileName);
    await writeFile(filePath, buffer);
    pdfUrl = `/service-pdfs/${fileName}`;
  }

  const client = await clientPromise;
  const db = client.db();
  const result = await db.collection('services').insertOne({
    title,
    short_desc,
    long_desc,
    pdfUrl,
  });

  return new Response(JSON.stringify({ insertedId: result.insertedId, pdfUrl }), {
    status: 201,
    headers: { 'Content-Type': 'application/json' },
  });
}
