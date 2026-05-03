import { NextResponse } from "next/server";

const AVATAR_PROMPT = `
Create a high-end cinematic cricket poster using the provided reference image. The subject’s face, facial structure, skin tone, and hairstyle must remain exactly true to the original image with no distortion or alteration—preserve identity with photorealistic accuracy. Add a natural, confident smile.

Compose the poster with three dynamic perspectives of the same person:

Extreme close-up portrait — sharp focus on the face, wearing the official India cricket team jersey (2025 edition), dramatic lighting, sweat texture, intense cinematic look.
Side profile view — showcasing the back of the jersey with the name “AHMAD” clearly visible, realistic fabric folds and lighting.
Full-body action shot — wearing complete cricket gear (India 2026 jersey, trousers, pads, gloves, helmet, and shoes), holding a bat in a powerful stance (ready to play or mid-action pose).

Style: Ultra-realistic, cinematic sports poster, high contrast lighting, stadium background with floodlights, slight motion blur, dust particles, depth of field.

Color grading: Rich, dramatic tones with blue/orange contrast, emphasizing energy and professionalism.

Add subtle elements like stadium crowd blur, light flares, and vignette for a premium sports magazine feel.

Output quality: 8K resolution, hyper-detailed, sharp, professional sports photography style.
`.trim();

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { imageUrl } = body;

    // Check for the imageUrl sent by the frontend
    if (!imageUrl) {
      return NextResponse.json(
        { error: "An imageUrl is required." },
        { status: 400 }
      );
    }

    const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        // 100% free model that supports image input + image output
        model: "bytedance-seed/seedream-4.5",
        messages: [
          {
            role: "user",
            content: [
              { type: "text", text: AVATAR_PROMPT },
              { type: "image_url", image_url: { url: imageUrl } }
            ],
          },
        ],
      }),
    });

    if (!res.ok) {
      const errorText = await res.text();
      console.error("OpenRouter Error:", errorText);
      return NextResponse.json(
        { error: `OpenRouter Error: ${errorText}` },
        { status: res.status }
      );
    }

    const data = await res.json();
    console.log("OpenRouter Raw Response:", JSON.stringify(data, null, 2));

    // Image-gen models return content as an array of parts
    // Each part has type: "text" or type: "image_url"
    const contentParts = data.choices?.[0]?.message?.content;
    let finalImageUrl: string | null = null;

    if (Array.isArray(contentParts)) {
      // Look for an image_url part in the response
      const imgPart = contentParts.find((p: { type: string }) => p.type === "image_url");
      finalImageUrl = imgPart?.image_url?.url ?? null;
    } else if (typeof contentParts === "string") {
      // Fallback: some models return a markdown link like ![img](https://...)
      const match = contentParts.match(/!\[.*?\]\((.*?)\)/);
      finalImageUrl = match ? match[1] : null;
    }

    if (!finalImageUrl) {
      console.error("No image found in response:", contentParts);
      return NextResponse.json(
        { error: "Model did not return an image. Try again." },
        { status: 500 }
      );
    }

    return NextResponse.json({
      image: finalImageUrl, // Frontend SuccessScreen expects this key
    });
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}