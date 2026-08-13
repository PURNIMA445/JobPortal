import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const aiUrl = process.env.NEXT_PUBLIC_AI_URL || 'http://127.0.0.1:8000';
    
    // We proxy it directly to the Python AI service
    const response = await fetch(`${aiUrl}/parse-cv`, {
      method: 'POST',
      headers: {
        'Content-Type': request.headers.get('content-type')
      },
      body: request.body,
      duplex: 'half',
    });

    if (!response.ok) {
      const text = await response.text();
      console.error("FastAPI parse-cv Error:", text);
      return NextResponse.json({ error: text || 'Failed to process resume' }, { status: response.status });
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error proxying parse-cv to AI service:', error.message);
    return NextResponse.json({ error: 'Failed to communicate with AI Service: ' + error.message }, { status: 500 });
  }
}
