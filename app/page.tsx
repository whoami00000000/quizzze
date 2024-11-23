'use client';

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
      <div className="bg-white p-6 rounded-lg shadow-md mt-4">
        <div className="text-lg font-semibold text-gray-800 mb-3">
          Вопрос {currentQuestionIndex + 1}/{questions.length}
        </div>
        <div className="text-gray-700 mb-4">{currentQuestion.question}</div>
        <div>
          {currentQuestion.answers.map((answer, index) => (
            <div key={index} className="flex items-center mb-2">
              <input
                type="radio"
                name={`answer-${currentQuestionIndex}`}
                id={`answer-${currentQuestionIndex}-${index}`}
                className="mr-2"
              />
              <label htmlFor={`answer-${currentQuestionIndex}-${index}`} className="text-gray-700">
                {answer.text}
              </label>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-3xl font-semibold text-[#007bff] mb-6">Тестирование</h1>

      <div className="mb-4">
        <select
          value={selectedFile}
          onChange={handleFileChange}
          className="p-2 border rounded-lg w-full"
        >
          <option value="">Выберите файл</option>
          {files.map(file => (
            <option key={file} value={file}>
              {file}
            </option>
          ))}
        </select>
      </div>

      <div className="mb-6">
        <div className="flex items-center mb-2">
          <input
            type="radio"
            value="normal"
            checked={mode === 'normal'}
            onChange={() => setMode('normal')}
            className="mr-2"
          />
          <label className="text-gray-700">Обычный режим</label>
        </div>
        <div className="flex items-center">
          <input
            type="radio"
            value="cabinet"
            checked={mode === 'cabinet'}
            onChange={() => setMode('cabinet')}
            className="mr-2"
          />
          <label className="text-gray-700">Тест-кабинет</label>
        </div>
      </div>

      <div className="mb-6">
        <button
          onClick={startQuiz}
          className="bg-[#007bff] text-white px-6 py-3 rounded-lg w-full hover:bg-[#0056b3] transition"
        >
          Начать тест
        </button>
      </div>

      {questions.length > 0 && renderQuestion()}

      {questions.length > 0 && (
        <div className="mt-4">
          <button
            onClick={handleNextQuestion}
            className="bg-[#28a745] text-white px-6 py-3 rounded-lg w-full hover:bg-[#218838] transition"
          >
            Следующий вопрос
          </button>
        </div>
      )}
    </div>
  );
}
