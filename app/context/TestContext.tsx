
'use client';

import { createContext, useContext, useState, useEffect } from 'react';

// Тип данных для тестов
interface Test {
  name: string;
  url: string;
}

interface TestContextType {
  tests: Test[];
  setTests: (tests: Test[]) => void;
}

const TestContext = createContext<TestContextType | undefined>(undefined);

export const useTestContext = () => {
  const context = useContext(TestContext);
  if (!context) {
    throw new Error('useTestContext must be used within a TestProvider');
  }
  return context;
};

export const TestProvider = ({ children }: { children: React.ReactNode }) => {
  const [tests, setTests] = useState<Test[]>([]);

  useEffect(() => {
    async function fetchTests() {
      const response = await fetch('https://api.github.com/repos/sergey-05/custom_quiz/contents/');
      const data = await response.json();
      console.log(data);
      const jsFiles = data.filter((file: any) => file.name.endsWith('.json'));
      setTests(jsFiles);
    }
    if (tests.length === 0) fetchTests(); // Загружаем только если еще не загружены
  }, [tests]);

  return (
    <TestContext.Provider value={{ tests, setTests }}>
      {children}
    </TestContext.Provider>
  );
};
