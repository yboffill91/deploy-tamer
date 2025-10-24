// src/lib/firebase.ts
import { initializeApp } from 'firebase/app';
import { getMessaging, getToken, onMessage } from 'firebase/messaging';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);

export const getMessagingInstance = () => {
  if (typeof globalThis !== 'undefined' && 'serviceWorker' in navigator) {
    return getMessaging(app);
  }
  return null;
};

export const requestToken = async () => {
  const messaging = getMessagingInstance();
  if (!messaging) return null;

  try {
    const currentToken = await getToken(messaging, {
      vapidKey: process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY,
    });
    return currentToken;
  } catch (error) {
    console.error('Error al obtener token FCM:', error);
    return null;
  }
};

export const listenForegroundMessages = (callback: (payload: any) => void) => {
  try {
    const messaging = getMessagingInstance();
    if (!messaging) {
      console.warn('FCM not available in this environment');
      return () => {};
    }

    return onMessage(messaging, (payload) => {
      callback(payload);
    });
  } catch (error) {
    console.warn('FCM not available, using mock listener');
    return () => {};
  }
};

// Mantener onMessageListener como está
export const onMessageListener = () =>
  new Promise((resolve) => {
    const messaging = getMessagingInstance();
    if (!messaging) return;

    onMessage(messaging, (payload) => {
      resolve(payload);
    });
  });
