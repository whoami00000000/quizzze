'use client';

import { useState } from 'react';
import { useTestContext } from './context/TestContext'; // Импорт контекста

export default function Home() {
  const { tests, setTests } = useTestContext(); // Получаем данные из контекста
  const [selectedFile, setSelectedFile] = useState<string>('');
  const [selectedMode, setSelectedMode] = useState<string>('view'); // Режим по умолчанию - 'view'

  const handleTestStart = (fileName: string) => {
    if (!selectedFile) return;

    let route = '';
    switch (selectedMode) {
      case 'view':
        route = `/test-view?file=${fileName}`;
        break;
      case 'dashboard':
        route = `/test-quize?file=${fileName}`;
        break;
      case 'quiz':
        route = `/test-dashboard?file=${fileName}`;
        break;
      default:
        route = `/test-view?file=${fileName}`;
        break;
    }

    window.location.href = route; // Переход на страницу в зависимости от выбранного режима
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-teal-900 to-gray-800 text-white p-8">
      <h1 className="text-3xl font-extrabold mb-8 text-center text-teal-300">Выберите тест и режим</h1>

      {/* Список доступных тестов */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tests.map((file) => (
          <div
            key={file.name}
            className={`p-6 rounded-lg shadow-lg bg-teal-800 text-center transition-transform duration-300 cursor-pointer hover:scale-105 ${
              selectedFile === file.name ? 'border-4 border-teal-400' : ''
            }`}
            onClick={() => setSelectedFile(file.name)}
          >
            <h2 className="text-2xl font-semibold">{file.name}</h2>
          </div>
        ))}
      </div>

      {/* Выбор режима */}
      <div className="mt-10">
        <h2 className="text-3xl font-semibold mb-4">Выберите режим</h2>
        <div className="flex space-x-4">
          <button
            className={`px-6 py-3 rounded-lg text-lg font-semibold transition-all ${
              selectedMode === 'view'
                ? 'bg-teal-400 text-black'
                : 'bg-teal-800 text-white hover:bg-teal-600'
            }`}
            onClick={() => setSelectedMode('view')}
          >
            Просмотр
          </button>
          <button
            className={`px-6 py-3 rounded-lg text-lg font-semibold transition-all ${
              selectedMode === 'dashboard'
                ? 'bg-teal-400 text-black'
                : 'bg-teal-800 text-white hover:bg-teal-600'
            }`}
            onClick={() => setSelectedMode('dashboard')}
          >
            Тест Кабинет
          </button>
          <button
            className={`px-6 py-3 rounded-lg text-lg font-semibold transition-all ${
              selectedMode === 'quiz'
                ? 'bg-teal-400 text-black'
                : 'bg-teal-800 text-white hover:bg-teal-600'
            }`}
            onClick={() => setSelectedMode('quiz')}
          >
            Обычное Тестирование
          </button>
        </div>
      </div>

      {/* Кнопка "Начать тест" */}
      <button
        className="bg-teal-500 text-white p-4 rounded-lg w-full mt-10 hover:bg-teal-400 transition-all duration-300 disabled:bg-teal-300"
        onClick={() => handleTestStart(selectedFile)}
        disabled={!selectedFile}
      >
        Начать {selectedMode === 'view' ? 'просмотр' : selectedMode === 'dashboard' ? 'тест кабинет' : 'тестирование'}
      </button>
    </div>
  );
}
