import { NextResponse } from 'next/server';



export async function POST(request) {
  try {
    // We proxy it directly to the Python AI service
    const response = await fetch('http://127.0.0.1:8000/upload-resume', {
      method: 'POST',
      headers: {
        'Content-Type': request.headers.get('content-type')
      },
      body: request.body,
      duplex: 'half',
    });

    if (!response.ok) {
      const text = await response.text();
      console.error("FastAPI Error:", text);
      return NextResponse.json({ error: text || 'Failed to process resume' }, { status: response.status });
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error proxying to AI service:', error.message);
    return NextResponse.json({ error: 'Failed to communicate with AI Service: ' + error.message }, { status: 500 });
  }
}

export async function uploadResume(resumeFile) {
  const token = getToken();
  const formData = new FormData();
  formData.append("resume", resumeFile);

  const response = await fetch(`${BASE_URL}/api/candidate/resume`, {
      method: "POST",
      headers: {
          Authorization: token ? `Bearer ${token}` : "",
      },
      body: formData,
  });

  return handleResponse(response);
}