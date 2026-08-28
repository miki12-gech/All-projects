// Phase 1: Gubae Abew
import {
  orthodoxTheologyCourse,
  sourcesOfTheologyCourse,
  classificationsOfTheologyCourse,
  theosisCourse,
  mistereSelassieAbew, // ✅ moved to last
} from "./gubae_abew/mistere_selassie";

// Phase 2: Gubae Hawaryat
import { negereBeteKristiyanHaw } from "./gubae_hawaryat/negere_bete_kristiyan";

// Phase 3: Gubae Eclessia
import { negereAbawEccl } from "./gubae_eclessia/negere_abaw";

// ----- Shared Types -----
export interface Lesson {
  id: string;
  title: string;
  content: string;
  inlineExplanations: any[];
}

export interface ExamQuestion {
  id: string;
  text: string;
  options: string[];
  correctAnswer: string;
  points?: number;
}

export interface Subject {
  id: string;
  title: string;
  description: string;
  lessons: Lesson[];
  exam?: {
    id: string;
    questions: ExamQuestion[];
  };
}

export interface PhaseContent {
  subjects: Subject[];
}

// ----- Course Data -----
export const courseContent: Record<string, PhaseContent> = {
  GUBAE_ABEW: {
    subjects: [
      orthodoxTheologyCourse,          // 1
      sourcesOfTheologyCourse,         // 2
      classificationsOfTheologyCourse, // 3
      theosisCourse,                   // 4
      mistereSelassieAbew,             // 5 (now last)
    ],
  },
  GUBAE_HAWARYAT: {
    subjects: [negereBeteKristiyanHaw],
  },
  GUBAE_ECCLESIAE: {
    subjects: [negereAbawEccl],
  },
};

export function getCourseContent(phase: string): PhaseContent | null {
  return courseContent[phase] || null;
}