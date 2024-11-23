import Link from 'next/link';
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
        <Link
          href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
