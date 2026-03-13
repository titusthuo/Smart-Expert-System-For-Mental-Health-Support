export const MOODS = [
  {
    emoji: "😊",
    label: "Happy",
    aiGreeting:
      "That's wonderful to hear! 😊 I'm really glad you're feeling happy today. What's been making your day so positive? I'd love to hear about it, and we can explore ways to keep that joy going!",
  },
  {
    emoji: "😔",
    label: "Sad",
    aiGreeting:
      "I'm sorry you're feeling sad right now. 💙 It takes courage to acknowledge that, and I'm here with you. Would you like to share what's been weighing on your heart?",
  },
  {
    emoji: "🤔",
    label: "Thoughtful",
    aiGreeting:
      "I see you're in a reflective space. 🤔 What's on your mind? Sometimes talking through our thoughts can bring clarity. I'm here to listen.",
  },
  {
    emoji: "🥱",
    label: "Tired",
    aiGreeting:
      "Feeling exhausted takes a toll. 🥱 Whether it's physical or emotional tiredness, it's important to acknowledge it. What's been draining your energy? Let's talk about rest and recovery.",
  },
  {
    emoji: "😕",
    label: "Confused",
    aiGreeting:
      "Confusion can feel unsettling. 😕 Let's work through this together. What's making you feel unclear or uncertain right now? Sometimes talking it out helps untangle the confusion.",
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
  {
    emoji: "😠",
    label: "Angry",
    aiGreeting:
      "Your anger is valid. 😠 It's okay to feel this way. What's making you angry right now? Sometimes expressing these feelings is the first step to processing them.",
  },
  {
    emoji: "😢",
    label: "Hurt",
    aiGreeting:
      "I'm so sorry you're hurting. 😢 Emotional pain is real pain. You don't have to go through this alone. What's happened that's causing you this hurt?",
  },
  {
    emoji: "😰",
    label: "Overwhelmed",
    aiGreeting:
      "Feeling overwhelmed is exhausting. 😰 Let's take this one step at a time. What feels like too much right now? We can work together to break things down into manageable pieces.",
  },
  {
    emoji: "😨",
    label: "Scared",
    aiGreeting:
      "It's brave of you to acknowledge your fear. 😨 What's making you feel scared or afraid? I'm here to help you feel safer and work through what's frightening you.",
  },
  {
    emoji: "😣",
    label: "Frustrated",
    aiGreeting:
      "Frustration can build up quickly. 😣 What's been bothering you or not working out the way you need? Let's talk about what's causing this frustration.",
  },
  {
    emoji: "😖",
    label: "Distressed",
    aiGreeting:
      "I'm here with you. 😖 Feeling distressed is really hard. You've taken an important step by reaching out. What's happening that's causing you this distress? Let's work through it together.",
  },
  {
    emoji: "😩",
    label: "Hopeless",
    aiGreeting:
      "I'm really glad you reached out. 😩 When everything feels hopeless, having someone to talk to matters. Please know that feelings can change, and you don't have to face this alone. What's making things feel so difficult right now?",
  },
  {
    emoji: "💪",
    label: "Confident",
    aiGreeting:
      "Yes! I love that confidence! 💪 What's making you feel so strong and capable today? Let's talk about your strengths and how you can channel this energy.",
  },
] as const;

export type MoodLabel = (typeof MOODS)[number]["label"];
