export const DEFAULT_GREETING =
  "Hello! I'm here to support you. How are you feeling today?";

export function isCriticalInput(input: string) {
  const lower = input.toLowerCase();

  return (
    lower.includes("suicid") ||
    lower.includes("kill myself") ||
    lower.includes("end my life") ||
    lower.includes("take my life") ||
    lower.includes("want to die") ||
    lower.includes("don't want to live") ||
    lower.includes("dont want to live") ||
    lower.includes("can't go on") ||
    lower.includes("cant go on") ||
    lower.includes("hurt myself") ||
    lower.includes("self harm") ||
    lower.includes("self-harm") ||
    lower.includes("cut myself") ||
    lower.includes("overdose")
  );
}

export function getAIResponse(input: string): string {
  const lower = input.toLowerCase();

  if (lower.includes("anxious") || lower.includes("anxiety")) {
    return "I understand that anxiety can feel overwhelming. Try this breathing exercise: Breathe in slowly for 4 counts, hold for 4, then exhale for 4. This can help calm your nervous system. Would you like to talk more about what's causing your anxiety?";
  }

  if (lower.includes("stress") || lower.includes("stressed")) {
    return "Stress is a common experience, and it's good that you're recognizing it. Some helpful techniques include taking short breaks, practicing mindfulness, or going for a walk. What specific situations are causing you stress?";
  }

  if (lower.includes("sleep") || lower.includes("insomnia")) {
    return "Sleep is crucial for mental health. Try establishing a consistent bedtime routine, avoiding screens an hour before bed, and creating a calm environment. How long have you been experiencing sleep difficulties?";
  }

  if (lower.includes("sad") || lower.includes("depressed")) {
    return "I'm sorry you're feeling this way. It's important to acknowledge these feelings. Activities like exercise, connecting with friends, or engaging in hobbies can help. How long have you been feeling like this?";
  }

  return "Thank you for sharing that with me. I'm here to listen and support you. Can you tell me more about what you're experiencing? Remember, you're not alone in this journey.";
}
