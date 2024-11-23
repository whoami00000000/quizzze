interface Answer {
    text: string;
    correct: boolean;
  }
  
  interface Question {
    question: string;
    answers: Answer[];
  }
  
  interface TestProps {
    questions: Question[]; // Массив вопросов
    loading: boolean;
    error: string | null;
  }
  