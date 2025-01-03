'use client';

import { useRef, useState } from 'react';
import Select from 'react-select';
import { useTestContext } from './context/TestContext'; // Импорт контекста
import { useRouter } from 'next/navigation';

// Определяем тип для опций Select
interface OptionType {
  value: string;
  label: string;
}


export default function Home() {
  const { tests } = useTestContext(); // Получаем данные из контекста
  const [selectedFile, setSelectedFile] = useState<OptionType | null>(null);
  const [selectedMode, setSelectedMode] = useState<string>('view'); // Режим по умолчанию - 'view'
  const router = useRouter();


  const handleTestStart = () => {
    if (!selectedFile) return;

    let route = '';
    switch (selectedMode) {
      case 'view':
        route = `/test-view?file=${selectedFile.value}`;
        break;
      case 'dashboard':
        route = `/test-quize?file=${selectedFile.value}`;
        break;
      case 'quiz':
        route = `/test-dashboard?file=${selectedFile.value}`;
        break;
      default:
        route = `/test-view?file=${selectedFile.value}`;
        break;
    }

    router.push(route);
  };


  

  const testOptions: OptionType[] = tests.map((test) => ({
    value: test.name,
    label: test.name,
  }));

  const modeOptions: OptionType[] = [
    { value: 'view', label: 'Просмотр' },
    { value: 'dashboard', label: 'Тест Кабинет' },
    { value: 'quiz', label: 'Обычное Тестирование' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-teal-900 to-gray-800 text-white p-4 sm:p-8">
      <h1 className="text-3xl sm:text-5xl font-extrabold mb-6 sm:mb-8 text-center text-teal-300">
        Выберите тест и режим
      </h1>

      {/* Выпадающий список для выбора теста */}
      <div className="mb-6">
        <h2 className="text-2xl sm:text-3xl font-semibold mb-4 text-center">Выберите тест</h2>
        <Select
          options={testOptions}
          value={selectedFile}
          onChange={(option) => setSelectedFile(option as OptionType)}
          placeholder="Выберите тест"
          className="text-black max-w-lg mx-auto"
          isSearchable
        />
      </div>

      {/* Выпадающий список для выбора режима */}
      <div className="mb-6">
        <h2 className="text-2xl sm:text-3xl font-semibold mb-4 text-center">Выберите режим</h2>
        <Select
          options={modeOptions}
          value={modeOptions.find((mode) => mode.value === selectedMode)}
          onChange={(option) => setSelectedMode((option as OptionType)?.value || 'view')}
          placeholder="Выберите режим"
          className="text-black max-w-lg mx-auto"
          isSearchable={false}
        />
      </div>

      {/* Кнопка "Начать тест" */}
      <button
        className="bg-teal-500 text-white p-3 sm:p-4 rounded-lg w-full max-w-lg mx-auto mt-8 sm:mt-10 hover:bg-teal-400 transition-all duration-300 disabled:bg-teal-300"
        onClick={handleTestStart}
        disabled={!selectedFile}
      >
        Начать {selectedMode === 'view' ? 'просмотр' : selectedMode === 'dashboard' ? 'тест кабинет' : 'тестирование'}
      </button>

    </div>
  );
}
