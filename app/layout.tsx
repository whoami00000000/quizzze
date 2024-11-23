'use client';

import { TestProvider } from './context/TestContext';
import './globals.css';
import WebApp from '@twa-dev/sdk';
import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Script from 'next/script';
import { BackButton } from '@twa-dev/sdk/react';


export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {


  const pathname = usePathname();
  const router = useRouter()
  const [isBackButtonVisible, setIsBackButtonVisible] = useState(false);

  useEffect(() => {
    const showArrow =
    pathname.startsWith('/test-dashboard') ||
    pathname.startsWith('/test-view') ||
    pathname.startsWith('/test-quize')

    setIsBackButtonVisible(showArrow);
  }, [pathname]);

  const handleBackClick = () => {
    console.log('Back button clicked');
    if (typeof window !== 'undefined') {
      router.back();
    }
  };

  if (typeof window === 'undefined') {
    return null;
  }

  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        WebApp.expand();
        WebApp.disableVerticalSwipes();
        WebApp.setHeaderColor('#1f2937');
        WebApp.setBottomBarColor('#1f2937');
      }catch(error){
        console.log(`error: ${error}`);
      }


    const preventGesture = (e: Event) => {
      e.preventDefault();
    };
    const preventTouchStart = (event: TouchEvent) => {
      if (event.touches.length > 1) {
        event.preventDefault();
      }
    };

    document.addEventListener('gesturestart', preventGesture);
    document.addEventListener('dblclick', preventGesture);
    document.addEventListener('touchstart', preventTouchStart, { passive: false });
    return () => {
      document.removeEventListener('gesturestart', preventGesture);
      document.removeEventListener('dblclick', preventGesture);
      document.removeEventListener('touchstart', preventTouchStart);
    };
  }
  }, []);


  

  return (
    <html lang="en">
      <head>
      <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"/>
      <Script src='https://telegram.org/js/telegram-web-app.js' strategy="beforeInteractive"/>
      </head>
      <TestProvider>
      {typeof window !== 'undefined' && isBackButtonVisible && (
            <BackButton onClick={handleBackClick} />
          )}
      <body>{children}</body>
      </TestProvider>
      
    </html>
  );
}
