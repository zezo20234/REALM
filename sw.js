/* =====================================================
HOUSE MYSTERY SERVICE WORKER
Firebase Cloud Messaging + Web Push
===================================================== */

const CACHE_NAME = "house-mystery-v5";

/* =====================================================
FIREBASE COMPAT
===================================================== */

importScripts(
  "https://www.gstatic.com/firebasejs/12.1.0/firebase-app-compat.js"
);

importScripts(
  "https://www.gstatic.com/firebasejs/12.1.0/firebase-messaging-compat.js"
);

/* =====================================================
FIREBASE CONFIG
===================================================== */

firebase.initializeApp({

  apiKey:
    "AIzaSyCug0S0qHKstGAr5vdzm-DaLZAIDugo",

  authDomain:
    "money-e560a.firebaseapp.com",

  databaseURL:
    "https://money-e560a-default-rtdb.firebaseio.com",

  projectId:
    "money-e560a",

  storageBucket:
    "money-e560a.firebasestorage.app",

  messagingSenderId:
    "477551627159",

  appId:
    "1:477551627159:web:b19f853905331f71ee92d2",

  measurementId:
    "G-YYQD2E5J7J"

});

/* =====================================================
FIREBASE MESSAGING
===================================================== */

let messaging = null;

try{

  messaging =
    firebase.messaging();

}
catch(error){

  console.error(
    "Firebase Messaging initialization failed:",
    error
  );

}

/* =====================================================
INSTALL
===================================================== */

self.addEventListener(
  "install",
  event => {

    event.waitUntil(
      self.skipWaiting()
    );

  }
);

/* =====================================================
ACTIVATE
===================================================== */

self.addEventListener(
  "activate",
  event => {

    event.waitUntil(

      (async()=>{

        try{

          const cacheNames =
            await caches.keys();

          await Promise.all(

            cacheNames
              .filter(
                name =>
                  name !== CACHE_NAME
              )
              .map(
                name =>
                  caches.delete(name)
              )

          );

        }
        catch(error){

          console.warn(
            "CACHE CLEANUP:",
            error
          );

        }

        await self.clients.claim();

      })()

    );

  }
);

/* =====================================================
FCM BACKGROUND MESSAGE
===================================================== */

if(
  messaging
){

  messaging.onBackgroundMessage(
    payload => {

      console.log(
        "FCM background message:",
        payload
      );

      const notification =
        payload?.notification ||
        {};

      const data =
        payload?.data ||
        {};

      const title =
        notification.title ||
        data.title ||
        "🔔 House Mystery";

      const body =
        notification.body ||
        data.body ||
        "You have a new House Mystery alert.";

      const tag =
        data.tag ||
        notification.tag ||
        (
          "house-mystery-" +
          Date.now()
        );

      return self.registration.showNotification(

        title,

        {

          body,

          icon:
            notification.icon ||
            "./icon-192.png",

          badge:
            notification.badge ||
            "./icon-192.png",

          tag,

          renotify:
            data.renotify === "true" ||
            notification.renotify === true,

          requireInteraction:
            data.requireInteraction === "true" ||
            notification.requireInteraction === true,

          vibrate:
            [
              250,
              120,
              250
            ],

          data:{

            roomCode:
              data.roomCode ||
              null,

            roundId:
              data.roundId ||
              null,

            taskId:
              data.taskId ||
              null,

            notificationType:
              data.notificationType ||
              null,

            url:
              data.url ||
              "./"

          }

        }

      );

    }
  );

}

/* =====================================================
RAW WEB PUSH FALLBACK
===================================================== */

self.addEventListener(
  "push",
  event => {

    /*
      FCM normally handles its own messages.

      This fallback keeps the service worker compatible
      with direct Web Push payloads as well.
    */

    event.waitUntil(

      (async()=>{

        let data = {};

        try{

          if(
            event.data
          ){

            data =
              event.data.json();

          }

        }
        catch(error){

          try{

            data = {

              body:
                event.data
                  ?.
                  text()
                ||
                ""

            };

          }
          catch{

            data = {};

          }

        }

        /*
          Avoid displaying a duplicate notification when
          the FCM SDK is already handling an FCM push.
        */

        if(
          data?.from ||
          data?.fcmOptions ||
          data?.collapseKey
        ){

          return;

        }

        const notification =
          data.notification ||
          data;

        const title =
          notification.title ||
          data.title ||
          "🔔 House Mystery";

        const body =
          notification.body ||
          data.body ||
          "You have a new House Mystery alert.";

        const tag =
          notification.tag ||
          data.tag ||
          (
            "house-mystery-" +
            Date.now()
          );

        await self.registration.showNotification(

          title,

          {

            body,

            icon:
              notification.icon ||
              "./icon-192.png",

            badge:
              notification.badge ||
              "./icon-192.png",

            tag,

            renotify:
              notification.renotify !== false,

            requireInteraction:
              Boolean(
                notification.requireInteraction
              ),

            vibrate:
              notification.vibrate ||
              [
                250,
                120,
                250
              ],

            data:{

              roomCode:
                data.roomCode ||
                null,

              roundId:
                data.roundId ||
                null,

              taskId:
                data.taskId ||
                null,

              notificationType:
                data.notificationType ||
                null,

              url:
                data.url ||
                "./"

            }

          }

        );

      })()

    );

  }
);

/* =====================================================
NOTIFICATION CLICK
===================================================== */

self.addEventListener(
  "notificationclick",
  event => {

    event.notification.close();

    const data =
      event.notification.data ||
      {};

    const targetUrl =
      data.url ||
      "./";

    event.waitUntil(

      (async()=>{

        try{

          const clientList =
            await clients.matchAll({

              type:
                "window",

              includeUncontrolled:
                true

            });

          const target =
            new URL(
              targetUrl,
              self.location.origin
            );

          /*
            First try to focus an existing House Mystery
            window.
          */

          for(
            const client
            of clientList
          ){

            try{

              const clientUrl =
                new URL(
                  client.url
                );

              if(
                clientUrl.origin ===
                target.origin
              ){

                if(
                  "focus" in client
                ){

                  return client.focus();

                }

              }

            }
            catch(error){

              console.warn(
                "CLIENT URL:",
                error
              );

            }

          }

          /*
            Otherwise open the notification destination.
          */

          if(
            clients.openWindow
          ){

            return clients.openWindow(
              target.href
            );

          }

        }
        catch(error){

          console.error(
            "NOTIFICATION CLICK:",
            error
          );

        }

      })()

    );

  }
);

/* =====================================================
NOTIFICATION CLOSE
===================================================== */

self.addEventListener(
  "notificationclose",
  event => {

    console.log(
      "House Mystery notification closed."
    );

  }
);

/* =====================================================
MESSAGE HANDLER
===================================================== */

self.addEventListener(
  "message",
  event => {

    if(
      event.data?.type ===
      "SKIP_WAITING"
    ){

      self.skipWaiting();

    }

  }
);