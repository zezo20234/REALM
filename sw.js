/* =====================================================
HOUSE MYSTERY SERVICE WORKER
Firebase Cloud Messaging + Web Push
===================================================== */

const CACHE_NAME =
  "house-mystery-v6";

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
MESSAGING
===================================================== */

let messaging = null;

try{

  messaging =
    firebase.messaging();

}
catch(error){

  console.error(
    "FCM INIT ERROR:",
    error
  );

}

/* =====================================================
INSTALL
===================================================== */

self.addEventListener(
  "install",
  event=>{

    event.waitUntil(

      (async()=>{

        try{

          await self.skipWaiting();

        }
        catch(error){

          console.warn(
            "SKIP WAITING:",
            error
          );

        }

      })()

    );

  }
);

/* =====================================================
ACTIVATE
===================================================== */

self.addEventListener(
  "activate",
  event=>{

    event.waitUntil(

      (async()=>{

        try{

          const cacheNames =
            await caches.keys();

          await Promise.all(

            cacheNames
              .filter(
                name =>
                  name !==
                  CACHE_NAME
              )
              .map(
                name =>
                  caches.delete(
                    name
                  )
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

    payload=>{

      console.log(
        "FCM BACKGROUND MESSAGE:",
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

      const notificationType =
        data.notificationType ||
        "general";

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

          /*
            IMPORTANT:

            A unique tag is used for every call/task,
            so a later notification doesn't replace
            the previous one.
          */

          renotify:
            true,

          requireInteraction:
            data.requireInteraction ===
            "true",

          vibrate:

            notificationType ===
            "call"

            ?

            [
              400,
              120,
              400,
              120,
              700
            ]

            :

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

            callId:
              data.callId ||
              null,

            notificationType,

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
  event=>{

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
                  ?
                  event.data.text()
                  :
                  ""

            };

          }
          catch{

            data = {};

          }

        }

        /*
          Ignore payloads intended for the FCM SDK.
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
              true,

            requireInteraction:
              Boolean(
                notification.requireInteraction
              ),

            vibrate:
              notification.notificationType ===
              "call"

              ?

              [
                400,
                120,
                400,
                120,
                700
              ]

              :

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

              callId:
                data.callId ||
                null,

              notificationType:
                data.notificationType ||
                "general",

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
  event=>{

    event.notification.close();

    const data =
      event.notification.data ||
      {};

    let targetUrl =
      data.url ||
      "./";

    /*
      Preserve the room when possible.
    */

    if(
      data.roomCode
    ){

      try{

        const url =
          new URL(
            targetUrl,
            self.location.origin
          );

        url.searchParams.set(
          "room",
          data.roomCode
        );

        targetUrl =
          url.href;

      }
      catch(error){

        console.warn(
          "TARGET URL:",
          error
        );

      }

    }

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
  event=>{

    console.log(
      "House Mystery notification closed:",
      event.notification?.tag
    );

  }

);

/* =====================================================
MESSAGE
===================================================== */

self.addEventListener(
  "message",
  event=>{

    if(
      event.data?.type ===
      "SKIP_WAITING"
    ){

      self.skipWaiting();

    }

  }

);