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
  const [incorrectQuestions, setIncorrectQuestions] = useState<Question[]>([]); // Массив неправильных вопросов


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
    if (isAnswerChecked) return; // Если ответы уже проверены, пользователь не может выбрать другие

    if (selectedAnswers.includes(answerText)) {
      setSelectedAnswers(selectedAnswers.filter((answer) => answer !== answerText));
    } else {
      if (!isMultipleChoice()) {
        // Если это радиокнопка (один правильный ответ), сбрасываем все другие ответы
        setSelectedAnswers([answerText]);
      } else {
        setSelectedAnswers([...selectedAnswers, answerText]);
      }
    }
  };

  const handleCheckAnswer = () => {
    const correctAnswers = questions?.[currentQuestionIndex]?.answers.filter((answer) => answer.correct);
    const selectedCorrectAnswers = questions?.[currentQuestionIndex]?.answers.filter((answer) =>
      selectedAnswers.includes(answer.text) && answer.correct
    );
    
    // Проверка, если количество правильных выбранных ответов совпадает с количеством правильных ответов
    if (
      selectedAnswers.length === correctAnswers?.length &&
      selectedCorrectAnswers?.length === correctAnswers?.length
    ) {
      setAnswerStatus('correct');
      setCorrectAnswersCount(correctAnswersCount + 1); // Увеличиваем счетчик правильных ответов
    } else {
      setAnswerStatus('incorrect');
      // Сохраняем неправильные вопросы
      if (questions) {
        setIncorrectQuestions((prev) => [...prev, questions[currentQuestionIndex]]);
      }
      
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

  const isMultipleChoice = () => {
    // Добавляем проверку на undefined для questions и текущего вопроса
    if (!questions || currentQuestionIndex === undefined || currentQuestionIndex >= questions.length) {
      return false; // Если данные еще не загружены или индекс некорректен, возвращаем false
    }
  
    const currentQuestion = questions[currentQuestionIndex];
    return currentQuestion.answers.filter((answer) => answer.correct).length > 1;
  };
  
  

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
          {/* Кнопка для работы с ошибками */}
          <button
  onClick={() => {
    setQuestions(incorrectQuestions); // Переходим к вопросам с ошибками
    setCurrentQuestionIndex(0); // Сбрасываем индекс текущего вопроса
    setTestFinished(false); // Завершаем тест
    setAnswerStatus(null); // Сбрасываем статус ответа
    setIsAnswerChecked(false); // Сбрасываем флаг проверки ответа
    setSelectedAnswers([]); // Сбрасываем выбранные ответы
    setCorrectAnswersCount(0);
  }}
  className="bg-teal-500 text-white p-3 rounded w-full mt-6 transition-colors"
>
  Работа над ошибками
</button>

        </div>
      </div>
    );
  }
  

  const currentQuestion = questions[currentQuestionIndex];

  return (
    <div className="min-h-screen bg-gray-800 text-white p-6">
      <h1 className="text-4xl font-bold mb-6 text-center text-teal-500">Обычное тестирование</h1>

      <div className="bg-gray-800 p-6 rounded-lg shadow-md space-y-6">
        <div className="mb-4">
            <div className='w-full justify-between items-center'>
                <p className="text-lg text-gray-400">Прогресс: {progress}%</p>
                <p className="text-lg text-gray-400">{currentQuestionIndex + 1}/{questions.length}</p>
            </div>
          
          <div className="h-2 bg-gray-600 rounded">
            <div
              className="h-full bg-teal-500 rounded"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>

        <h2 className="text-2xl font-semibold mb-4">{currentQuestionIndex + 1}. {currentQuestion.question}</h2>

        <ul className="list-none p-0 space-y-4">
          {currentQuestion.answers.map((answer, index) => {
            const isSelected = selectedAnswers.includes(answer.text);
            const isCorrect = answer.correct;
            const isAnswerCheckedClass = isAnswerChecked
              ? isCorrect
                ? 'bg-green-400' // Подсвечиваем правильный ответ
                : 'bg-red-400' // Подсвечиваем неправильный ответ
              : '';

            return (
              <li
                key={index}
                onClick={() => handleAnswerSelect(answer.text)}
                className={`p-3 rounded-2xl cursor-pointer ${isAnswerChecked ? isAnswerCheckedClass : 'bg-gray-700'}`}
              >
                {isMultipleChoice() ? (
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => handleAnswerSelect(answer.text)}
                    disabled={isAnswerChecked} // Отключаем изменение после проверки
                    className="mr-2"
                  />
                ) : (
                  <input
                    type="radio"
                    name="answer"
                    checked={isSelected}
                    onChange={() => handleAnswerSelect(answer.text)}
                    disabled={isAnswerChecked} // Отключаем изменение после проверки
                    className="mr-2"
                  />
                )}
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
