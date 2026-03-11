export const MOODS = [
  {
    emoji: "😊",
    label: "Great",
    aiGreeting:
      "That's wonderful to hear! 😊 I'm really glad you're feeling great today. What's been making your day so positive? I'd love to hear about it, and we can also explore ways to keep that energy going!",
  },
  {
    emoji: "😐",
    label: "Okay",
    aiGreeting:
      "Thanks for checking in. Feeling 'okay' is perfectly valid — sometimes days are just neutral, and that's alright. Is there anything on your mind you'd like to talk through, or anything that could make today feel a little better?",
  },
  {
    emoji: "😔",
    label: "Low",
    aiGreeting:
      "I'm sorry you're feeling low right now. 💙 It takes courage to acknowledge that, and I'm here with you. Would you like to share what's been weighing on you? Sometimes just talking about it can help lighten the load.",
  },
  {
    emoji: "😟",
    label: "Anxious",
    aiGreeting:
      "I hear you — anxiety can feel really overwhelming. 🤍 Let's take a breath together first. Try inhaling slowly for 4 counts, holding for 4, then exhaling for 4. Whenever you're ready, tell me what's been causing you to feel anxious.",
  },
  {
    emoji: "😤",
    label: "Stressed",
    aiGreeting:
      "I can understand how draining stress feels. You've done the right thing by reaching out. 💪 Let's work through this together — what's the biggest source of stress for you right now? We can break it down step by step.",
  },
] as const;

export type MoodLabel = (typeof MOODS)[number]["label"];
