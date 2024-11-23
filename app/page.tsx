import React, { useState, useEffect, ChangeEvent } from 'react';
import styles from './page.module.css';

// Интерфейсы
interface Question {
  question: string;
  answers: { text: string; correct: boolean }[];
}

interface FileData {
  name: string;
  url: string;
}

export default function Home() {
  const [files, setFiles] = useState<string[]>([]);
  const [selectedFile, setSelectedFile] = useState<string>('');
  const [mode, setMode] = useState<'normal' | 'cabinet'>('normal');
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [correctAnswers, setCorrectAnswers] = useState<number>(0);
  const [incorrectlyAnsweredQuestions, setIncorrectlyAnsweredQuestions] = useState<number[]>([]);
  const [quizFiles, setQuizFiles] = useState<Record<string, Question[]>>({});

  useEffect(() => {
    async function fetchFiles() {
      try {
        const response = await fetch('https://api.github.com/repos/sergey-05/custom_quiz/contents/');
        const data: FileData[] = await response.json();
        const jsFiles = data.filter(file => file.name.endsWith('.js'));
        setFiles(jsFiles.map(file => file.name));
      } catch (error) {
        console.error('Ошибка загрузки файлов:', error);
      }
    }

    fetchFiles();
  }, []);

  async function loadScript(url: string): Promise<string> {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Не удалось загрузить скрипт: ${url}`);
    }
    return await response.text();
  }

  const handleFileChange = async (event: ChangeEvent<HTMLSelectElement>) => {
    const file = event.target.value;
    setSelectedFile(file);
    if (file) {
      try {
        const scriptContent = await loadScript(`https://sergey-05.github.io/custom_quiz/${file}`);
        const scriptFunction = new Function(scriptContent + ';\nreturn questions;') as () => Question[];
        const questionsData = scriptFunction();
        setQuizFiles(prev => ({ ...prev, [file]: questionsData }));
      } catch (error) {
        alert('Не удалось загрузить вопросы. Проверьте файл.');
        console.error(error);
      }
    }
  };

  const startQuiz = () => {
    if (quizFiles[selectedFile]?.length > 0) {
      let selectedQuestions = quizFiles[selectedFile];
      if (mode === 'cabinet' && selectedQuestions.length > 50) {
        selectedQuestions = selectedQuestions.sort(() => Math.random() - 0.5).slice(0, 50);
      }
      setQuestions(selectedQuestions);
      setCurrentQuestionIndex(0);
      setCorrectAnswers(0);
      setIncorrectlyAnsweredQuestions([]);
    } else {
      alert('Пожалуйста, выберите файл для тестирования.');
    }
  };

  const handleAnswerCheck = () => {
    const currentQuestion = questions[currentQuestionIndex];
    const isCorrect = currentQuestion.answers.every((answer, index) => {
      const isSelected = (document.getElementById(`answer-${currentQuestionIndex}-${index}`) as HTMLInputElement)?.checked;
      return (answer.correct && isSelected) || (!answer.correct && !isSelected);
    });

    if (!isCorrect && !incorrectlyAnsweredQuestions.includes(currentQuestionIndex)) {
      setIncorrectlyAnsweredQuestions(prev => [...prev, currentQuestionIndex]);
    }
  };

  const handleNextQuestion = () => {
    handleAnswerCheck();
    if (currentQuestionIndex + 1 < questions.length) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      alert('Тест завершен!');
      // Здесь можно показать результаты
    }
  };

  const renderQuestion = () => {
    if (questions.length === 0) return null;

    const currentQuestion = questions[currentQuestionIndex];

    return (
      <div>
        <div>
          Вопрос {currentQuestionIndex + 1}/{questions.length}
        </div>
        <div>{currentQuestion.question}</div>
        <div>
          {currentQuestion.answers.map((answer, index) => (
            <div key={index}>
              <input
                type="radio"
                name={`answer-${currentQuestionIndex}`}
                id={`answer-${currentQuestionIndex}-${index}`}
              />
              <label htmlFor={`answer-${currentQuestionIndex}-${index}`}>{answer.text}</label>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className={styles.container}>
      <h1 className="pb-3 text-[#007bff] text-2xl">Тестирование</h1>

      <div>
        <select value={selectedFile} onChange={handleFileChange}>
          <option value="">Выберите файл</option>
          {files.map(file => (
            <option key={file} value={file}>{file}</option>
          ))}
        </select>
      </div>

      <div>
        <label>
          <input
            type="radio"
            value="normal"
            checked={mode === 'normal'}
            onChange={() => setMode('normal')}
          />
          Обычный режим
        </label>
        <label>
          <input
            type="radio"
            value="cabinet"
            checked={mode === 'cabinet'}
            onChange={() => setMode('cabinet')}
          />
          Тест-кабинет
        </label>
      </div>

      <button onClick={startQuiz}>Начать тест</button>

      {questions.length > 0 && renderQuestion()}

      {questions.length > 0 && (
        <button onClick={handleNextQuestion}>Следующий вопрос</button>
      )}
    </div>
  );
}
