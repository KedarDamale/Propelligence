import { cookies } from 'next/headers';

export async function POST(req) {
  try {
    const { authenticated } = await req.json();
    const cookieStore = await cookies();
    
    if (authenticated) {
      // Set secure HTTP-only cookie
      cookieStore.set('admin-auth', 'true', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 60 * 60 * 24, // 24 hours
        path: '/'
      });
      
      return new Response(JSON.stringify({ success: true }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    } else {
      // Clear the cookie
      cookieStore.delete('admin-auth');
      
      return new Response(JSON.stringify({ success: true }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    }
  } catch {
    return new Response(JSON.stringify({ error: 'Failed to set cookie' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
} 