interface Answer {
    text: string;
    correct: boolean;
  }
  
  interface Question {
    question: string;
    answers: Answer[];
  }

  export interface UserDataTg {
    id: number;
    first_name: string;
    photo_url?: string;
  };
  