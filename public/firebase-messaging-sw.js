/* eslint-env serviceworker */
/* global importScripts, firebase */
importScripts("https://www.gstatic.com/firebasejs/9.23.0/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/9.23.0/firebase-messaging-compat.js");

firebase.initializeApp({
  apiKey: "AIzaSyCHBxVap7E2QOoUCwFDzH_ziaN8ZTeVz6w",
  authDomain: "tamerkeylinkdariel.firebaseapp.com",
  projectId: "tamerkeylinkdariel",
  storageBucket: "tamerkeylinkdariel.firebasestorage.app",
  messagingSenderId: "1073081716603",
  appId: "1:1073081716603:web:61d81f542c1db7609cb7de",
  measurementId: "G-32WLR2RB3H",
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage(function (payload) {
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: "/firebase-logo.png",
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
