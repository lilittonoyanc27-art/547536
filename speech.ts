/**
 * Speech synthesis helper for Spanish pronunciation
 */

let cachedVoice: SpeechSynthesisVoice | null = null;

function getSpanishVoice(): SpeechSynthesisVoice | null {
  if (typeof window === 'undefined' || !window.speechSynthesis) return null;
  if (cachedVoice) return cachedVoice;

  const voices = window.speechSynthesis.getVoices();
  // Prefer standard European Spanish or Mexican Spanish
  const esVoice = voices.find(v => v.lang.startsWith('es-ES')) ||
                  voices.find(v => v.lang.startsWith('es-')) ||
                  voices.find(v => v.lang.toLowerCase().includes('spanish'));
  
  if (esVoice) {
    cachedVoice = esVoice;
  }
  return esVoice || null;
}

// Pre-load voices if available
if (typeof window !== 'undefined' && window.speechSynthesis) {
  window.speechSynthesis.onvoiceschanged = () => {
    cachedVoice = null;
    getSpanishVoice();
  };
}

export function speakSpanish(text: string, onEnd?: () => void): boolean {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    console.warn('Speech synthesis not available in this browser');
    return false;
  }

  try {
    window.speechSynthesis.cancel(); // Stop any pending speech

    // Clean up text from brackets or markup if any
    const cleanText = text
      .replace(/[¿?¡!]/g, '')
      .replace(/___+/g, '...')
      .trim();

    const utterance = new SpeechSynthesisUtterance(cleanText || text);
    utterance.lang = 'es-ES';
    utterance.rate = 0.88; // Slightly slower, calm and natural for kids/beginners
    utterance.pitch = 1.05; // Slightly warmer/friendly pitch

    const voice = getSpanishVoice();
    if (voice) {
      utterance.voice = voice;
    }

    if (onEnd) {
      utterance.onend = () => onEnd();
      utterance.onerror = () => onEnd();
    }

    window.speechSynthesis.speak(utterance);
    return true;
  } catch (err) {
    console.error('Speech synthesis error:', err);
    if (onEnd) onEnd();
    return false;
  }
}

export function stopSpeaking(): void {
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }
}
