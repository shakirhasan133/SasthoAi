import { NextResponse } from 'next/server';
import { serialize } from 'cookie';

export async function POST() {
  const options = {
    name: 'session',
    value: '',
    maxAge: -1,
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
  };

  const cookie = serialize(options.name, options.value, options);

  return new NextResponse(JSON.stringify({ status: 'success' }), {
    status: 200,
    headers: { 'Set-Cookie': cookie },
  });
}
