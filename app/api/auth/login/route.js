import { NextResponse } from 'next/server';
import { parse, serialize } from 'cookie';
import admin from '../../../../lib/firebase-admin';
import dbConnect from '../../../../lib/mongodb';
import User from '../../../../models/User';

export async function POST(request) {
  try {
    const { idToken } = await request.json();
    const expiresIn = 60 * 60 * 24 * 5 * 1000; // 5 days

    const decodedIdToken = await admin.auth().verifyIdToken(idToken);
    const sessionCookie = await admin.auth().createSessionCookie(idToken, { expiresIn });

    await dbConnect();
    const user = await User.findOneAndUpdate(
      { email: decodedIdToken.email },
      {
        name: decodedIdToken.name,
        email: decodedIdToken.email,
        photoURL: decodedIdToken.picture,
        uid: decodedIdToken.uid,
      },
      { upsert: true, new: true }
    );

    const options = {
      name: 'session',
      value: sessionCookie,
      maxAge: expiresIn,
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
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
