export enum UserRole {
  STUDENT = 'Student',
  PARENT = 'Parent',
  STAFF = 'Staff'
}

export interface User {
  id: string; // The ID used for lookup (National ID, Mobile, Employee ID)
  name: string;
  role: UserRole;
  dayRecords: Record<string, number>; // "Day 1": 1 (Correct) or 0 (Wrong)
}

export interface Question {
  day: string;
  text: string;
  options: string[];
  correctOptionIndex: number; // 0-based index
}

export interface AppState {
  currentDay: string; // "NA" or "Day 1", "Day 2", etc.
  currentUser: User | null;
  currentQuestion: Question | null;
  isLoading: boolean;
  error: string | null;
  quizStatus: 'idle' | 'in-progress' | 'completed' | 'timeout' | 'already-submitted';
}

export interface GoogleSheetResponse {
  status: string; // "Day X" or "NA"
  user?: User;
  question?: Question;
  isAlreadySubmitted?: boolean;
}