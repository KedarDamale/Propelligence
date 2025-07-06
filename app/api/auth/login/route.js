// POST: Authenticate admin login
export async function POST(req) {
  const { username, password } = await req.json();
  const envUser = process.env.ADMIN_USERNAME;
  const envPass = process.env.ADMIN_PASSWORD;
  console.log('DEBUG ENV USER:', envUser);
  console.log('DEBUG ENV PASS:', envPass);
  console.log('DEBUG INPUT USER:', username);
  console.log('DEBUG INPUT PASS:', password);
  if (username === envUser && password === envPass) {
    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } else {
    return new Response(JSON.stringify({ success: false, error: 'Invalid credentials' }), { status: 401 });
  }
}
