import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import admin from '../../../lib/firebase-admin';
import dbConnect from '../../../lib/mongodb';
import Disease from '../../../models/Disease';

async function verifySession(cookie) {
  if (!cookie) return null;
  try {
    const decodedToken = await admin.auth().verifySessionCookie(cookie, true);
    return decodedToken;
  } catch (error) {
    return null;
  }
}

export async function POST(request) {
  const sessionCookie = cookies().get('session')?.value || '';
  const user = await verifySession(sessionCookie);

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { name, description, symptoms, treatments } = await request.json();
    await dbConnect();
    const disease = await Disease.create({
      name,
      description,
      symptoms,
      treatments,
      createdBy: user.uid,
    });
    return NextResponse.json(disease, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create disease' }, { status: 500 });
  }
}

export async function GET() {
  const sessionCookie = cookies().get('session')?.value || '';
  const user = await verifySession(sessionCookie);

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    await dbConnect();
    const diseases = await Disease.find({ createdBy: user.uid }).sort({ createdAt: -1 });
    return NextResponse.json(diseases);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch diseases' }, { status: 500 });
  }
}
