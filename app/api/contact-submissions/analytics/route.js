import clientPromise from '../../../../lib/mongodb';
import { ContactSubmission } from '../../../../lib/contactSubmissionSchema';

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db();
    const total = await db.collection('contact_submissions').countDocuments();
    // Most selected services
    const servicesAgg = await db.collection('contact_submissions').aggregate([
      { $unwind: "$services" },
      { $group: { _id: "$services", count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]).toArray();
    // Preferred contact modes breakdown
    const contactModesAgg = await db.collection('contact_submissions').aggregate([
      { $unwind: "$contactModes" },
      { $group: { _id: "$contactModes", count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]).toArray();
    return new Response(JSON.stringify({
      total,
      mostSelectedServices: servicesAgg,
      contactModesBreakdown: contactModesAgg
    }), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
} 