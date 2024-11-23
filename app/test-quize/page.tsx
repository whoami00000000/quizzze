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

const TestQuize = () => {
  const [questions, setQuestions] = useState<Question[] | undefined>(undefined);
  const [randomQuestions, setRandomQuestions] = useState<Question[]>([]); // Храним случайные вопросы
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

          // Выбираем случайные 50 вопросов (если они есть)
          const randomSelectedQuestions = getRandomQuestions(data, 50);
          setRandomQuestions(randomSelectedQuestions);
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

  const getRandomQuestions = (questions: Question[], count: number): Question[] => {
    const shuffled = [...questions].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  };

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
    const correctAnswers = randomQuestions[currentQuestionIndex]?.answers.filter((answer) => answer.correct);
    const selectedCorrectAnswers = randomQuestions[currentQuestionIndex]?.answers.filter((answer) =>
      selectedAnswers.includes(answer.text) && answer.correct
    );
    
    if (
      selectedAnswers.length === correctAnswers?.length &&
      selectedCorrectAnswers?.length === correctAnswers?.length
    ) {
      setAnswerStatus('correct');
      setCorrectAnswersCount(correctAnswersCount + 1); // Увеличиваем счетчик правильных ответов
    } else {
      setAnswerStatus('incorrect');
      if (randomQuestions) {
        setIncorrectQuestions((prev) => [...prev, randomQuestions[currentQuestionIndex]]);
      }
    }
  
    setIsAnswerChecked(true); // Отметка, что ответ проверен
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex + 1 < randomQuestions.length) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setIsAnswerChecked(false); // Сбрасываем флаг проверки для следующего вопроса
      setAnswerStatus(null); // Сбрасываем статус ответа
      setSelectedAnswers([]); // Сбрасываем выбранные ответы
    } else {
      // Завершаем тест, если вопросов больше нет
      setTestFinished(true);
    }
  };

  const progress = Math.round(((currentQuestionIndex + 1) / (randomQuestions.length || 1)) * 100);

  const isMultipleChoice = () => {
    const currentQuestion = randomQuestions[currentQuestionIndex];
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

  if (!randomQuestions || randomQuestions.length === 0) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-900 text-white">
        <p className="text-xl">Нет вопросов для отображения</p>
      </div>
    );
  }

  if (testFinished) {
    const totalQuestions = randomQuestions.length;
    const percentage = Math.round((correctAnswersCount / totalQuestions) * 100);
  
    return (
      <div className="min-h-screen bg-gray-800 text-white p-6">
        <h1 className="text-4xl font-bold mb-6 text-center text-teal-500">Тест завершён</h1>
        <div className="bg-gray-700 p-6 rounded-lg shadow-md text-center">
          <p className="text-2xl">Вы правильно ответили на {correctAnswersCount} из {totalQuestions} вопросов.</p>
          <p className="text-xl text-teal-500">Процент правильных ответов: {percentage}%</p>
          <button
            onClick={() => {
              setRandomQuestions(incorrectQuestions);
              setCurrentQuestionIndex(0);
              setTestFinished(false);
              setAnswerStatus(null);
              setIsAnswerChecked(false);
              setSelectedAnswers([]);
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

  const currentQuestion = randomQuestions[currentQuestionIndex];

  return (
    <div className="min-h-screen bg-gray-800 text-white p-6">
      <h1 className="text-4xl font-bold mb-6 text-center text-teal-500">Тест Кабинет</h1>

      <div className="bg-gray-800 p-6 rounded-lg shadow-md space-y-6">
        <div className="mb-4">
        <div className='w-full justify-between items-center'>
                <p className="text-lg text-gray-400">Прогресс: {progress}%</p>
                <p className="text-lg text-gray-400">{currentQuestionIndex + 1}/{randomQuestions?.length}</p>
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
                ? 'bg-green-400'
                : 'bg-red-400'
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
                    disabled={isAnswerChecked}
                    className="mr-2"
                  />
                ) : (
                  <input
                    type="radio"
                    checked={isSelected}
                    onChange={() => handleAnswerSelect(answer.text)}
                    disabled={isAnswerChecked}
                    className="mr-2"
                  />
                )}
                <span>{answer.text}</span>
              </li>
            );
          })}
        </ul>

        {/* {isAnswerChecked ? (
          <div className="mt-6 text-xl">
            <p className={answerStatus === 'correct' ? 'text-green-400' : 'text-red-400'}>
              {answerStatus === 'correct' ? 'Правильный ответ!' : 'Неправильный ответ!'}
            </p>
          </div>
        ) : (
          <button
            onClick={handleCheckAnswer}
            className="bg-teal-500 text-white p-3 rounded w-full mt-6"
          >
            Проверить ответ
          </button>
        )} */}

        {!isAnswerChecked && (
          <button
            onClick={handleCheckAnswer}
            className="bg-teal-500 text-white p-3 rounded w-full mt-6 transition-colors"
            disabled={selectedAnswers.length === 0}
          >
            Проверить ответ
          </button>
        )}

        {/* <button
          onClick={handleNextQuestion}
          className="bg-teal-500 text-white p-3 rounded w-full mt-6"
          disabled={isAnswerChecked}
        >
          Следующий вопрос
        </button> */}

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

export default TestQuize;
