'use client';

import { useRef, useState } from 'react';
import Select, { SingleValue } from 'react-select';
import { useTestContext } from './context/TestContext'; // Импорт контекста
import { useRouter } from 'next/navigation';
import Image from 'next/image';

// Определяем тип для опций Select
interface OptionType {
  value: string;
  label: string;
}

interface ClickEffect {
  id: number;
  top: number;
  left: number;
}

export default function Home() {
  const { tests } = useTestContext(); // Получаем данные из контекста
  const [selectedFile, setSelectedFile] = useState<OptionType | null>(null);
  const [selectedMode, setSelectedMode] = useState<string>('view'); // Режим по умолчанию - 'view'
  const router = useRouter();

  const imageRef = useRef<HTMLImageElement>(null);
  const [clickEffects, setClickEffects] = useState<ClickEffect[]>([]);

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


  const handleTouch = (e: React.TouchEvent<HTMLDivElement>) => {
      const rect = imageRef.current?.getBoundingClientRect();

      if (rect) {
        const touches = e.touches;

        // Обрабатываем все точки касания
        for (let i = 0; i < touches.length; i++) {
          const touch = touches[i];
          const x = touch.clientX;
          const y = touch.clientY - rect.top;

          // Добавляем эффект клика
          const id = Math.random();
          setClickEffects((prevEffects) => [...prevEffects, { id, top: y, left: x }]);

          // Удаляем эффект через 1.5 секунды
          setTimeout(() => {
            setClickEffects((prevEffects) => prevEffects.filter((effect) => effect.id !== id));
          }, 1500);
        }

        // Анимация сжатия
        if (imageRef.current) {
          imageRef.current.classList.add('scale-95');
          setTimeout(() => {
            if (imageRef.current) {
              imageRef.current.classList.remove('scale-95');
            }
          }, 150);
        }
      }
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

      <div
        onTouchStart={handleTouch} // Используем onTouchStart для обработки касаний
        className="w-full h-full flex-grow flex justify-center items-center relative transition-transform duration-1000"
      >
        <Image
          ref={imageRef}
          src="/hogpng.png"
          width={165}
          height={270}
          alt="Cat Character"
          className="bg-transparent object-cover transition-transform duration-150"
        />

{clickEffects.map((effect) => (
  <div
    key={effect.id}
    className="absolute text-white text-2xl font-bold animate-fade-up"
    style={{
      top: effect.top,
      left: effect.left,
      transform: 'translate(-50%, 0)', // Центрируем по X и Y
    }}
          >
            Малик, сосал?
          </div>
        ))}
      </div>

    </div>
  );
}
