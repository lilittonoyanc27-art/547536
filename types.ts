export type TopicId = 
  | 'tener'
  | 'tener_que'
  | 'hay_tener'
  | 'muy_mucho'
  | 'bien_bueno'
  | 'poco'
  | 'estar_gerundio'
  | 'seguir_gerundio';

export type ExerciseFormat = 
  | 'choose_word'
  | 'translate_choice'
  | 'fill_blank'
  | 'reorder_words'
  | 'find_error'
  | 'text_input'
  | 'sentence_meaning'
  | 'mini_dialogue';

export type Level = 1 | 2 | 3;

export interface ExerciseOption {
  id: string;
  text: string;
  textRu?: string;
  isCorrect?: boolean;
  explanationIfChosen?: string;
}

export interface ExerciseExplanation {
  correctEs: string;
  correctRu: string;
  why: string;
  extraExampleEs?: string;
  extraExampleRu?: string;
  ruleTip?: string;
}

export interface Exercise {
  id: string;
  topicId: TopicId;
  level: Level;
  format: ExerciseFormat;
  promptRu: string;
  contextEs?: string; // For fill_blank (e.g. "Yo ___ cansado") or Spanish prompt
  contextEsTranslation?: string;
  dialogueSpeaker?: string;
  dialogueReplica?: string;
  dialogueReplicaRu?: string;
  options?: ExerciseOption[];
  correctAnswer: string;
  acceptedAnswers?: string[];
  words?: string[]; // Scrambled words for reordering
  correctOrder?: string[];
  hasErrorOption?: {
    sentence: string;
    sentenceRu: string;
    hasError: boolean;
    fixOptions?: { text: string; isCorrect: boolean; explanationIfChosen?: string }[];
  };
  explanation: ExerciseExplanation;
  hint?: string;
}

export interface ConjugationRow {
  pronoun: string;
  form: string;
  translation: string;
}

export interface SpecialExpression {
  phrase: string;
  translation: string;
  note?: string;
}

export interface DifferenceSide {
  title: string;
  subtitle: string;
  badge: string;
  badgeColor: string;
  formula: string;
  examples: {
    es: string;
    ru: string;
    highlightWord: string;
  }[];
  warning?: string;
}

export interface LessonData {
  id: TopicId;
  title: string;
  spanishTitle: string;
  icon: string;
  shortDesc: string;
  color: string;
  ruleStage: {
    heroTitle: string;
    simpleRules: string[];
    conjugations?: ConjugationRow[];
    specialExpressions?: SpecialExpression[];
    crucialNote?: {
      title: string;
      text: string;
    };
  };
  examplesStage: {
    simple: { es: string; ru: string; note?: string }[];
    extended: { es: string; ru: string; note?: string }[];
  };
  differenceStage: {
    title: string;
    explanation: string;
    left: DifferenceSide;
    right: DifferenceSide;
    third?: DifferenceSide;
  };
  practiceQuestions: Exercise[];
  quizQuestions: Exercise[]; // 10 distinct questions
}

export interface UserMistakeRecord {
  id: string;
  topicId: TopicId;
  questionId: string;
  prompt: string;
  chosenAnswer: string;
  correctAnswer: string;
  explanation: string;
  timestamp: number;
}

export interface UserProgress {
  completedLessons: TopicId[];
  stars: number;
  totalAnswered: number;
  totalCorrect: number;
  topicMastery: Record<TopicId, { attempted: number; correct: number }>;
  mistakes: UserMistakeRecord[];
}

export interface TeacherFilterConfig {
  selectedTopics: TopicId[];
  selectedLevel: 'all' | 1 | 2 | 3;
  questionCount: 5 | 10 | 15 | 20 | 30;
  hintsEnabled: boolean;
  selectedFormats: ExerciseFormat[];
  onlyMistakes: boolean;
}
