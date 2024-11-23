'use client';

import { useState } from 'react';
import { useTestContext } from './context/TestContext'; // Импорт контекста

export default function Home() {
  const { tests, setTests } = useTestContext(); // Получаем данные из контекста
  const [selectedFile, setSelectedFile] = useState<string>('');
  const [selectedMode, setSelectedMode] = useState<string>('view'); // Режим по умолчанию - 'view'
  const [isFileSelected, setIsFileSelected] = useState<boolean>(false);

  const handleTestStart = (fileName: string) => {
    if (!selectedFile) return;

    setIsFileSelected(true);

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
    <div className="min-h-screen bg-gradient-to-r from-blue-900 via-teal-900 to-gray-800 text-white p-8">
      <h1 className="text-5xl font-extrabold mb-8 text-center text-teal-400">Выберите тест и режим</h1>

      <div className="bg-gray-700 p-8 rounded-lg shadow-xl space-y-8">
        {/* Выбор файла теста */}
        <div>
          <h2 className="text-3xl font-semibold mb-6">Выберите файл теста</h2>
          <select
            className="border border-teal-500 p-4 rounded-lg w-full bg-gray-800 text-white focus:ring-2 focus:ring-teal-500 focus:outline-none transition-all duration-300"
            value={selectedFile}
            onChange={(e) => setSelectedFile(e.target.value)}
          >
            <option value="">Выберите файл теста</option>
            {tests.map((file) => (
              <option key={file.name} value={file.name}>
                {file.name}
              </option>
            ))}
          </select>
        </div>

        {/* Выбор режима */}
        <div>
          <h2 className="text-3xl font-semibold mb-6">Выберите режим</h2>
          <div className="flex flex-col space-y-4">
            <label className="flex items-center text-lg cursor-pointer hover:text-teal-300">
              <input
                type="radio"
                name="mode"
                value="view"
                checked={selectedMode === 'view'}
                onChange={() => setSelectedMode('view')}
                className="mr-4 rounded-lg transition-all duration-200"
              />
              Просмотр
            </label>
            <label className="flex items-center text-lg cursor-pointer hover:text-teal-300">
              <input
                type="radio"
                name="mode"
                value="dashboard"
                checked={selectedMode === 'dashboard'}
                onChange={() => setSelectedMode('dashboard')}
                className="mr-4 rounded-lg transition-all duration-200"
              />
              Тест Кабинет
            </label>
            <label className="flex items-center text-lg cursor-pointer hover:text-teal-300">
              <input
                type="radio"
                name="mode"
                value="quiz"
                checked={selectedMode === 'quiz'}
                onChange={() => setSelectedMode('quiz')}
                className="mr-4 rounded-lg transition-all duration-200"
              />
              Обычное Тестирование
            </label>
          </div>
        </div>

        {/* Кнопка "Начать тест" */}
        <button
          className="bg-teal-500 text-white p-4 rounded-lg w-full mt-6 hover:bg-teal-400 transition-all duration-300 disabled:bg-teal-300"
          onClick={() => handleTestStart(selectedFile)}
          disabled={!selectedFile}
        >
          Начать {selectedMode === 'view' ? 'просмотр' : selectedMode === 'dashboard' ? 'тест кабинет' : 'тестирование'}
        </button>
      </div>
    </div>
  );
}
