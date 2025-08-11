import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import admin from '../../../../lib/firebase-admin';
import dbConnect from '../../../../lib/mongodb';
import Disease from '../../../../models/Disease';

async function verifySession(cookie) {
  if (!cookie) return null;
  try {
    const decodedToken = await admin.auth().verifySessionCookie(cookie, true);
    return decodedToken;
  } catch (error) {
    return null;
  }
}

export async function GET(request, { params }) {
  const sessionCookie = cookies().get('session')?.value || '';
  const user = await verifySession(sessionCookie);

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    await dbConnect();
    const disease = await Disease.findOne({ _id: params.id, createdBy: user.uid });
    if (!disease) {
      return NextResponse.json({ error: 'Disease not found' }, { status: 404 });
    }
    return NextResponse.json(disease);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch disease' }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  const sessionCookie = cookies().get('session')?.value || '';
  const user = await verifySession(sessionCookie);

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { name, description, symptoms, treatments } = await request.json();
    await dbConnect();
    const disease = await Disease.findOneAndUpdate(
      { _id: params.id, createdBy: user.uid },
      { name, description, symptoms, treatments },
      { new: true }
    );
    if (!disease) {
      return NextResponse.json({ error: 'Disease not found or not owned by user' }, { status: 404 });
    }
    return NextResponse.json(disease);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update disease' }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  const sessionCookie = cookies().get('session')?.value || '';
  const user = await verifySession(sessionCookie);

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    await dbConnect();
    const disease = await Disease.findOneAndDelete({ _id: params.id, createdBy: user.uid });
    if (!disease) {
      return NextResponse.json({ error: 'Disease not found or not owned by user' }, { status: 404 });
    }
    return NextResponse.json({ message: 'Disease deleted successfully' });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete disease' }, { status: 500 });
  }
}
