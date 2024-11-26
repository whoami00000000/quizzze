import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import WebApp from '@twa-dev/sdk';
import { UserDataTg } from '../lib/definitions';
import { FaExclamationTriangle } from 'react-icons/fa';

const UserBlockedNotification = () => {
  const [isBlocked, setIsBlocked] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        WebApp.expand();
        WebApp.disableVerticalSwipes();
        WebApp.setHeaderColor('#1f2937');
        WebApp.setBottomBarColor('#1f2937');

        const tgUser = WebApp.initDataUnsafe.user as UserDataTg;

        // 1146307806

        if (tgUser.id === 1395968585) {
          setIsBlocked(true);
        } else {
          WebApp.close();
        }
      } catch (error) {
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
    <>
      {isBlocked && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ duration: 0.5, ease: 'easeInOut' }}
          className="fixed top-0 left-0 w-full h-full bg-gradient-to-br from-red-500 via-pink-600 to-purple-600 flex items-center justify-center z-50"
        >
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: 'easeOut', delay: 0.3 }}
            className="bg-white rounded-lg shadow-2xl p-8 text-center max-w-md"
          >
            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-red-600 text-white rounded-full p-4">
              <FaExclamationTriangle className="text-4xl animate-bounce" />
            </div>
            <h2 className="text-3xl font-extrabold text-red-600 mb-4">Доступ ограничен</h2>
            <p className="text-lg text-gray-800 mb-6">
              Ваш аккаунт заблокирован. Обратитесь в поддержку, если считаете это ошибкой.
            </p>
            <p className="text-lg text-gray-800 mb-6">
              Малик сосаааааать
            </p>
          </motion.div>
        </motion.div>
      )}
    </>
  );
};

export default UserBlockedNotification;
