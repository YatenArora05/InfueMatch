import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { message, conversationHistory, userType = 'influencer' } = await req.json();

    if (!message || typeof message !== 'string') {
      return NextResponse.json(
        { error: "Message is required and must be a string" },
        { status: 400 }
      );
    }

    const groqApiKey = process.env.GROQ_API_KEY;

    if (!groqApiKey) {
      console.error("GROQ_API_KEY is not set in environment variables");
      return NextResponse.json(
        { error: "AI service is not configured" },
        { status: 500 }
      );
    }

    // Prepare messages array for GROQ API
    const messages = [];
    
    // Add conversation history if provided
    if (conversationHistory && Array.isArray(conversationHistory)) {
      conversationHistory.forEach((msg: { sender: string; text: string }) => {
        if (msg.sender === 'user') {
          messages.push({ role: 'user', content: msg.text });
        } else if (msg.sender === 'ai') {
          messages.push({ role: 'assistant', content: msg.text });
        }
      });
    }

    // Add system message for context based on user type
    const systemPrompt = userType === 'brand' 
      ? 'You are a helpful AI assistant for an influencer marketing platform. Help brands with questions about finding influencers, campaign management, analytics, influencer partnerships, budget planning, and platform features. Be friendly, professional, and concise.'
      : 'You are a helpful AI assistant for an influencer marketing platform. Help influencers with questions about their profile, brand partnerships, content creation, analytics, and platform features. Be friendly, professional, and concise.';
    
    messages.unshift({
      role: 'system',
      content: systemPrompt
    });

    // Add the current user message
    messages.push({ role: 'user', content: message });

    // Call GROQ API
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${groqApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: "llama-3.1-8b-instant" ,
        messages: messages,
        temperature: 0.7,
        max_tokens: 1024,
      }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('GROQ API error:', errorData);
      return NextResponse.json(
        { error: "Failed to get AI response" },
        { status: response.status }
      );
    }

    const data = await response.json();
    const aiResponse = data.choices?.[0]?.message?.content || "I'm sorry, I couldn't generate a response. Please try again.";

    return NextResponse.json(
      { response: aiResponse },
      { status: 200 }
    );
  } catch (error) {
    console.error("Chatbot API error:", error);
    return NextResponse.json(
      { error: "An error occurred while processing your request" },
      { status: 500 }
    );
  }
}

