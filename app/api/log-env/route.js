// This API route logs environment variables to the console when accessed
export function GET() {
  console.log('USER:', process.env.USER);
  console.log('PASSWORD:', process.env.PASSWORD);
  console.log('DATABASE:', process.env.DATABASE);
  return new Response(JSON.stringify({ message: 'Environment variables logged to console.' }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
}
