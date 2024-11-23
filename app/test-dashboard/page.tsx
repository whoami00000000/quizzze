'use client';
import React, { useState, useEffect } from 'react';

type Answer = {
  text: string;
  correct: boolean;
};

type Question = {
  question: string;
  answers: Answer[];
};

const TestDashboard = () => {
  const [questions, setQuestions] = useState<Question[] | undefined>(undefined);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<string[]>([]); // Для вопросов с несколькими ответами
  const [answerStatus, setAnswerStatus] = useState<'correct' | 'incorrect' | null>(null); // Статус ответа
  const [isAnswerChecked, setIsAnswerChecked] = useState(false); // Флаг для проверки ответа
  const [correctAnswersCount, setCorrectAnswersCount] = useState(0); // Счётчик правильных ответов
  const [testFinished, setTestFinished] = useState(false); // Флаг завершения теста

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const fileName = params.get('file'); // Название файла из URL

    if (fileName) {
      const fetchTest = async () => {
        try {
          const response = await fetch(`https://raw.githubusercontent.com/Sergey-05/custom_quiz/main/${fileName}`);
          const data: Question[] = await response.json();
          setQuestions(data);
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

  const handleAnswerSelect = (answerText: string) => {
    if (selectedAnswers.includes(answerText)) {
      setSelectedAnswers(selectedAnswers.filter((answer) => answer !== answerText));
    } else {
      setSelectedAnswers([...selectedAnswers, answerText]);
    }
  };

  const handleCheckAnswer = () => {
    const correctAnswers = questions?.[currentQuestionIndex]?.answers.filter((answer) => answer.correct);
    const selectedCorrectAnswers = questions?.[currentQuestionIndex]?.answers.filter((answer) =>
      selectedAnswers.includes(answer.text) && answer.correct
    );
    
    // Проверка, если количество правильных выбранных ответов совпадает с количеством правильных ответов
    if (
      selectedAnswers.length === 0 || 
      (selectedCorrectAnswers && selectedCorrectAnswers.length === correctAnswers?.length)
    ) {
      setAnswerStatus('correct');
      setCorrectAnswersCount(correctAnswersCount + 1); // Увеличиваем счетчик правильных ответов
    } else {
      setAnswerStatus('incorrect');
    }

    setIsAnswerChecked(true); // Отметка, что ответ проверен
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex + 1 < questions?.length!) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setIsAnswerChecked(false); // Сбрасываем флаг проверки для следующего вопроса
      setAnswerStatus(null); // Сбрасываем статус ответа
      setSelectedAnswers([]); // Сбрасываем выбранные ответы
    } else {
      // Завершаем тест, если вопросов больше нет
      setTestFinished(true);
    }
  };

  const progress = Math.round(((currentQuestionIndex + 1) / (questions?.length || 1)) * 100);

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

  if (testFinished) {
    const totalQuestions = questions.length;
    const percentage = Math.round((correctAnswersCount / totalQuestions) * 100);

    return (
      <div className="min-h-screen bg-gray-800 text-white p-6">
        <h1 className="text-4xl font-bold mb-6 text-center text-teal-500">Тест завершён</h1>
        <div className="bg-gray-700 p-6 rounded-lg shadow-md text-center">
          <p className="text-2xl">Вы правильно ответили на {correctAnswersCount} из {totalQuestions} вопросов.</p>
          <p className="text-xl text-teal-500">Процент правильных ответов: {percentage}%</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-800 text-white p-6">
      <h1 className="text-4xl font-bold mb-6 text-center text-teal-500">Тест Кабинет</h1>

      <div className="bg-gray-800 p-6 rounded-lg shadow-md space-y-6">
        <div className="mb-4">
          <p className="text-lg text-gray-400">Прогресс: {progress}%</p>
          <div className="h-2 bg-gray-600 rounded">
            <div
              className="h-full bg-teal-500 rounded"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>

        <h2 className="text-2xl font-semibold mb-4">{currentQuestionIndex + 1}. {questions[currentQuestionIndex].question}</h2>

        <ul className="list-none p-0 space-y-4">
          {questions[currentQuestionIndex].answers.map((answer, index) => {
            const isSelected = selectedAnswers.includes(answer.text);
            const answerClass = isSelected
              ? 'bg-teal-600' // Выделение выбранного варианта
              : 'bg-gray-700';
            const isCorrect = answer.correct;
            const isAnswerCheckedClass = isAnswerChecked
              ? isCorrect
                ? 'bg-green-600' // Подсвечиваем правильный ответ
                : 'bg-red-600' // Подсвечиваем неправильный ответ
              : '';

            return (
              <li
                key={index}
                onClick={() => handleAnswerSelect(answer.text)}
                className={`p-3 rounded-2xl cursor-pointer ${answerClass} ${isAnswerChecked ? isAnswerCheckedClass : ''}`}
              >
                <input
                  type="checkbox"
                  checked={isSelected}
                  onChange={() => handleAnswerSelect(answer.text)}
                  className="mr-2"
                />
                {answer.text}
              </li>
            );
          })}
        </ul>

        {!isAnswerChecked && (
          <button
            onClick={handleCheckAnswer}
            className="bg-teal-500 text-white p-3 rounded w-full mt-6 transition-colors"
            disabled={selectedAnswers.length === 0}
          >
            Проверить ответ
          </button>
        )}

        {isAnswerChecked && (
          <button
            onClick={handleNextQuestion}
            className="bg-teal-500 text-white p-3 rounded w-full mt-6 transition-colors"
          >
            Далее
          </button>
        )}
      </div>
    </div>
  );
};

export default TestDashboard;
