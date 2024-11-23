'use client';

import { useState } from 'react';
import { useTestContext } from './context/TestContext'; // Импорт контекста
import { useRouter } from 'next/navigation';

export default function Home() {
  const { tests, setTests } = useTestContext(); // Получаем данные из контекста
  const [selectedFile, setSelectedFile] = useState<string>('');
  const [selectedMode, setSelectedMode] = useState<string>('view'); // Режим по умолчанию - 'view'

  const handleTestStart = (fileName: string) => {

    const router = useRouter();
    
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

    router.push(route);
    
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-teal-900 to-gray-800 text-white p-4 sm:p-8">
      <h1 className="text-3xl sm:text-5xl font-extrabold mb-6 sm:mb-8 text-center text-teal-300">
        Выберите тест и режим
      </h1>

      {/* Список доступных тестов */}
      <div className="flex flex-wrap gap-4 justify-center">
        {tests.map((file) => (
          <div
            key={file.name}
            className={`p-4 sm:p-6 rounded-lg shadow-lg bg-teal-800 text-center transition-transform duration-300 cursor-pointer hover:scale-105 w-full sm:w-1/2 lg:w-1/3 max-w-xs ${
              selectedFile === file.name ? 'border-4 border-teal-400' : ''
            }`}
            onClick={() => setSelectedFile(file.name)}
          >
            <h2 className="text-xl sm:text-2xl font-semibold truncate">{file.name}</h2>
          </div>
        ))}
      </div>

      {/* Выбор режима */}
      <div className="mt-8">
        <h2 className="text-2xl sm:text-3xl font-semibold mb-4">Выберите режим</h2>
        <div className="flex flex-wrap justify-center gap-4">
          <button
            className={`px-4 py-2 sm:px-6 sm:py-3 rounded-lg text-lg font-semibold transition-all ${
              selectedMode === 'view'
                ? 'bg-teal-400 text-black'
                : 'bg-teal-800 text-white hover:bg-teal-600'
            }`}
            onClick={() => setSelectedMode('view')}
          >
            Просмотр
          </button>
          <button
            className={`px-4 py-2 sm:px-6 sm:py-3 rounded-lg text-lg font-semibold transition-all ${
              selectedMode === 'dashboard'
                ? 'bg-teal-400 text-black'
                : 'bg-teal-800 text-white hover:bg-teal-600'
            }`}
            onClick={() => setSelectedMode('dashboard')}
          >
            Тест Кабинет
          </button>
          <button
            className={`px-4 py-2 sm:px-6 sm:py-3 rounded-lg text-lg font-semibold transition-all ${
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
        className="bg-teal-500 text-white p-3 sm:p-4 rounded-lg w-full mt-8 sm:mt-10 hover:bg-teal-400 transition-all duration-300 disabled:bg-teal-300"
        onClick={() => handleTestStart(selectedFile)}
        disabled={!selectedFile}
      >
        Начать {selectedMode === 'view' ? 'просмотр' : selectedMode === 'dashboard' ? 'тест кабинет' : 'тестирование'}
      </button>
    </div>
  );
}
