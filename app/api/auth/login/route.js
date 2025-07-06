// POST: Authenticate admin login
export async function POST(req) {
  try {
    const { username, password } = await req.json();
    
    // Get credentials from environment variables
    const adminUsername = process.env.ADMIN_USERNAME;
    const adminPassword = process.env.ADMIN_PASSWORD;
    
    // Simple username and password comparison
    if (username === adminUsername && password === adminPassword) {
      return new Response(JSON.stringify({ 
        authenticated: true,
        message: 'Login successful'
      }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    } else {
      return new Response(JSON.stringify({ 
        authenticated: false,
        message: 'Invalid credentials'
      }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }
  } catch (error) {
    console.error('Login error:', error);
    return new Response(JSON.stringify({ 
      authenticated: false,
      message: 'Login failed'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
