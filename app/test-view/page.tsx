'use client';
import React, { useEffect, useState } from 'react';

type Answer = {
  text: string;
  correct: boolean;
};

type Question = {
  question: string;
  answers: Answer[];
};

const TestView = () => {
  const [questions, setQuestions] = useState<Question[] | undefined>(undefined);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Получаем параметр 'file' из строки запроса
    const params = new URLSearchParams(window.location.search);
    const fileName = params.get('file'); // Название файла, переданное через URL

    if (fileName) {
      const fetchTest = async () => {
        try {
          // Загружаем JSON файл
          const response = await fetch(`https://raw.githubusercontent.com/Sergey-05/custom_quiz/main/${fileName}`);
          const data: Question[] = await response.json(); // Парсим как JSON
          setQuestions(data); // Сохраняем данные в state
        } catch (err) {
          setError('Не удалось загрузить вопросы');
          console.error('Ошибка загрузки:', err);
        } finally {
          setLoading(false);
        }
      };

      fetchTest();
    } else {
      setError('Не найден параметр file в URL');
      setLoading(false);
    }
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-900 text-white">
        <div className="text-xl animate-pulse">Загрузка...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-900 text-white">
        <p className="text-red-400 text-xl">{error}</p>
      </div>
    );
  }

  if (!questions || questions.length === 0) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-900 text-white">
        <p className="text-xl">Нет вопросов для отображения</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-800 text-white p-6">
      <h1 className="text-4xl font-bold mb-6 text-center text-teal-500">Просмотр теста</h1>
      <div className="space-y-6">
        {questions.map((question, index) => (
          <div
            key={index}
            className="bg-gradient-to-r from-gray-700 to-gray-800 p-6 rounded-lg shadow-lg hover:shadow-2xl transition-shadow duration-300"
          >
            <h2 className="text-2xl font-semibold mb-4 text-teal-300">
              Вопрос #{index + 1}. {question.question}
            </h2>
            <ul className="space-y-2">
              {question.answers.map((answer, idx) => (
                <li
                  key={idx}
                  className={`p-4 rounded-lg shadow-sm transition-transform transform ${
                    answer.correct
                      ? 'bg-gradient-to-r from-green-400 to-green-500 hover:scale-105'
                      : 'bg-gradient-to-r from-red-400 to-red-500 hover:scale-105'
                  }`}
                >
                  <span
                    className={`mr-3 text-xl ${
                      answer.correct ? 'text-green-100' : 'text-red-100'
                    }`}
                  />
                  <span>{answer.text}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TestView;
