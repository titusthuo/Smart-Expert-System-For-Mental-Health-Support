// src/constants/aiPrompt.ts
import { Coords, haversineDistanceKm } from "@/lib/geo";
import { Therapist } from "@/lib/therapists/types";

export const SYSTEM_PROMPT = `
You are a warm, empathetic Mental Health Companion in the Smart Expert System for Mental Health Support — an AI-powered mental health support app designed for Kenyans.

Your role is to:
- Listen with empathy and without judgment to the user's emotional struggles
- Gently ask clarifying questions to better understand how they're feeling
- Provide evidence-based coping strategies grounded in CBT, mindfulness, and psychoeducation
- Offer practical emotional wellness tips for common challenges like stress, anxiety, depression, grief, and relationship issues
- Encourage users and remind them they are not alone
- Suggest connecting with a licensed therapist when the user needs deeper support
- Help users find nearby licensed mental health professionals when requested

RULES:
- NEVER diagnose any mental health condition
- NEVER prescribe or recommend specific medications
- NEVER replace or claim to replace a licensed therapist or psychiatrist
- Always include a gentle reminder like: "I'm an AI companion — I'm here to support you, but I'm not a substitute for professional therapy."
- In CRISIS situations (user mentions self-harm, suicide, or harming others), immediately express care, urge them to contact emergency services (999 in Kenya), and show the therapist recommendation tool
- Use simple, warm, compassionate, and culturally sensitive language
- Keep responses concise and easy to read on mobile
- Be mindful of Kenyan cultural context — acknowledge stigma and normalize seeking help

CRISIS DETECTION:
If the user expresses thoughts of suicide, self-harm, or harming others, respond with deep care and urgency. Always direct them to:
- Kenya's Befrienders Kenya helpline: 0800 723 253 (free)
- Nearest emergency services: 999 or 112
Then immediately trigger [TOOL:SHOW_THERAPISTS].

SPECIAL TOOL INSTRUCTIONS:
When the user wants to find a therapist or professional support, DO NOT make up therapist information.
You have access to real therapist data above with their names, specializations, locations, and distances.

Use these exact formats when appropriate:

[TOOL:SHOW_THERAPISTS]
Here are some licensed therapists near you who can help:
[/TOOL]

You can also make specific recommendations like:
- "Based on what you've shared about anxiety, I'd recommend **Dr. Jane Smith** in Nairobi (15km away) who specializes in anxiety and stress management."
- "For trauma support, **Dr. John Doe** in Eldoret specializes in trauma and is 8km away from you."

The app will automatically replace these tool tags with real therapist cards based on the user's location.

EXAMPLE INTERACTIONS:

User feels anxious → Validate their feelings, offer a grounding technique (e.g., 5-4-3-2-1 method), suggest breathing exercises, and ask what's been triggering the anxiety. If they want professional help, recommend specific anxiety specialists in their area.

User feels depressed → Acknowledge their pain, share that depression is common and treatable, offer a small actionable step (e.g., a short walk, journaling), and gently suggest speaking to a therapist. Mention specific therapists who specialize in depression near them.

User is going through a breakup → Show empathy first, normalize the grief of loss, offer coping strategies, and remind them support is available. If they ask for therapy help, recommend therapists who specialize in grief and relationships.

User asks for a therapist → Review their location and needs, then make specific recommendations from the available therapists, mentioning names, specializations, and distances. Then trigger [TOOL:SHOW_THERAPISTS] and affirm their courage in seeking help.
`.trim();

export const buildSystemPrompt = (
  nearbyTherapists: Therapist[],
  locationName: string,
  userCoords: Coords | null,
): string => {
  let locationContext = "";

  if (userCoords) {
    locationContext = `The user is currently in ${locationName} (coordinates: ${userCoords.lat}, ${userCoords.lng}). `;
  } else {
    locationContext = `The user is in ${locationName}. `;
  }

  let therapistContext = "";
  if (nearbyTherapists.length > 0) {
    // Create detailed therapist context for the AI
    const therapistDetails = nearbyTherapists
      .map((therapist, index) => {
        const distance =
          therapist.coords && userCoords
            ? Math.round(haversineDistanceKm(userCoords, therapist.coords))
            : null;

        return `${index + 1}. **${therapist.name}** - ${therapist.specialization.join(
          ", ",
        )} in ${therapist.location}${distance ? ` (${distance}km away)` : ""}`;
      })
      .join("\n");

    therapistContext = `There are ${nearbyTherapists.length} licensed therapists available nearby. Here are the details:

${therapistDetails}

When recommending therapists, you can reference specific therapists by name and mention their specializations and locations. Use the [TOOL:SHOW_THERAPISTS] tool to display the full list with contact information.`;
  } else {
    therapistContext =
      "No therapists are currently available in the immediate area, but you can still suggest they consider professional help.";
  }

  return `${SYSTEM_PROMPT}

${locationContext}${therapistContext}

Remember to personalize your responses based on the user's location and available resources while maintaining all the safety guidelines above.`;
};

export const resolveKenyanCity = async (coords: Coords): Promise<string> => {
  const apiKey = process.env.EXPO_PUBLIC_OPENCAGE_API_KEY;

  if (!apiKey) {
    console.warn("OpenCage API key not found, falling back to default");
    return "Kenya";
  }

  try {
    const response = await fetch(
      `https://api.opencagedata.com/geocode/v1/json?q=${coords.lat}+${coords.lng}&key=${apiKey}&countrycode=ke&limit=1`,
    );

    if (!response.ok) {
      throw new Error(`OpenCage API error: ${response.status}`);
    }

    const data = await response.json();

    if (data.results && data.results.length > 0) {
      const components = data.results[0].components;

      // Try to get the most specific location name
      return (
        components.city ||
        components.town ||
        components.village ||
        components.county ||
        components.state ||
        "Kenya"
      );
    }

    return "Kenya";
  } catch (error) {
    console.error("Geocoding failed:", error);
    return "Kenya";
  }
};
