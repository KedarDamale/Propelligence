import { list } from '@vercel/blob';

export async function GET() {
  try {
    // Check if BLOB_READ_WRITE_TOKEN is configured
    if (!process.env.BLOB_READ_WRITE_TOKEN) {
      return new Response(JSON.stringify({ 
        error: 'BLOB_READ_WRITE_TOKEN not configured',
        message: 'Please set up Vercel Blob storage token in environment variables'
      }), {
        status: 503,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // List all blobs to calculate storage usage
    const { blobs } = await list();
    
    // Calculate total size
    const totalSize = blobs.reduce((sum, blob) => sum + blob.size, 0);
    const totalSizeMB = (totalSize / (1024 * 1024)).toFixed(2);
    const totalSizeGB = (totalSize / (1024 * 1024 * 1024)).toFixed(2);
    
    // Count files by type
    const blogPdfs = blobs.filter(blob => blob.pathname.startsWith('blog-pdfs/'));
    const servicePdfs = blobs.filter(blob => blob.pathname.startsWith('service-pdfs/'));
    
    const usage = {
      totalFiles: blobs.length,
      totalSizeBytes: totalSize,
      totalSizeMB: parseFloat(totalSizeMB),
      totalSizeGB: parseFloat(totalSizeGB),
      freeTierLimitGB: 1,
      remainingGB: Math.max(0, 1 - parseFloat(totalSizeGB)),
      usagePercentage: Math.min(100, (parseFloat(totalSizeGB) / 1) * 100),
      byType: {
        blogPdfs: {
          count: blogPdfs.length,
          sizeMB: (blogPdfs.reduce((sum, blob) => sum + blob.size, 0) / (1024 * 1024)).toFixed(2)
        },
        servicePdfs: {
          count: servicePdfs.length,
          sizeMB: (servicePdfs.reduce((sum, blob) => sum + blob.size, 0) / (1024 * 1024)).toFixed(2)
        }
      }
    };

    return new Response(JSON.stringify(usage), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Storage usage error:', error);
    
    // Provide more specific error messages
    if (error.message?.includes('No token found')) {
      return new Response(JSON.stringify({ 
        error: 'BLOB_READ_WRITE_TOKEN not configured',
        message: 'Please set up Vercel Blob storage token in environment variables'
      }), {
        status: 503,
        headers: { 'Content-Type': 'application/json' },
      });
    }
    
    return new Response(JSON.stringify({ error: 'Failed to get storage usage' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
} 