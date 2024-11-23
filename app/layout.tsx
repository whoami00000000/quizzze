import { TestProvider } from './context/TestContext';
import './globals.css';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Тест-кабинет',
  description: 'Простое приложение',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
      </head>
      <TestProvider>
      <body>{children}</body>
      </TestProvider>
      
    </html>
  );
}
