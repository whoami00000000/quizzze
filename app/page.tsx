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
        route = `/test-dashboard?file=${fileName}`;
        break;
      case 'quiz':
        route = `/test-quiz?file=${fileName}`;
        break;
      default:
        route = `/test-view?file=${fileName}`;
        break;
    }

    window.location.href = route; // Переход на страницу в зависимости от выбранного режима
  };

  return (
    <div className="min-h-screen bg-gray-800 text-white p-6">
      <h1 className="text-4xl font-bold mb-6 text-center text-teal-500">Выберите тест и режим</h1>

      <div className="bg-gray-700 p-6 rounded-lg shadow-md space-y-6">
        <div>
          <h2 className="text-2xl font-semibold mb-4">Выберите файл теста</h2>
          <select
            className="border p-3 rounded w-full bg-gray-800 text-white focus:outline-none"
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

        <div>
          <h2 className="text-2xl font-semibold mb-4">Выберите режим</h2>
          <div className="flex flex-col space-y-3">
            <label className="flex items-center text-lg">
              <input
                type="radio"
                name="mode"
                value="view"
                checked={selectedMode === 'view'}
                onChange={() => setSelectedMode('view')}
                className="mr-3"
              />
              Просмотр
            </label>
            <label className="flex items-center text-lg">
              <input
                type="radio"
                name="mode"
                value="dashboard"
                checked={selectedMode === 'dashboard'}
                onChange={() => setSelectedMode('dashboard')}
                className="mr-3"
              />
              Тест Кабинет
            </label>
            <label className="flex items-center text-lg">
              <input
                type="radio"
                name="mode"
                value="quiz"
                checked={selectedMode === 'quiz'}
                onChange={() => setSelectedMode('quiz')}
                className="mr-3"
              />
              Обычное Тестирование
            </label>
          </div>
        </div>

        <button
          className="bg-teal-500 text-white p-3 rounded w-full mt-6 hover:bg-teal-400 transition-colors disabled:opacity-50"
          onClick={() => handleTestStart(selectedFile)}
          disabled={!selectedFile}
        >
          Начать {selectedMode === 'view' ? 'просмотр' : selectedMode === 'dashboard' ? 'тест кабинет' : 'тестирование'}
        </button>
      </div>
    </div>
  );
}
