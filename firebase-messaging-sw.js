/* =====================================================
HOUSE MYSTERY SERVICE WORKER
Firebase Cloud Messaging + Web Push
===================================================== */

const CACHE_NAME = "house-mystery-v7";

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

  /*
    IMPORTANT:
    This is the EXACT apiKey from the Firebase
    configuration you provided.
  */

  apiKey:
    "AIzaSyCug0S0qHKstXGZArd5vEBzm-DaLZAIDugo",

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

try {

  messaging =
    firebase.messaging();

}
catch(error) {

  console.error(
    "[House Mystery] FCM initialization failed:",
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
      (async () => {

        try {

          await self.skipWaiting();

        }
        catch(error) {

          console.warn(
            "[House Mystery] skipWaiting failed:",
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
  event => {

    event.waitUntil(
      (async () => {

        try {

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
                  caches.delete(
                    name
                  )
              )
          );

        }
        catch(error) {

          console.warn(
            "[House Mystery] cache cleanup failed:",
            error
          );

        }

        try {

          await self.clients.claim();

        }
        catch(error) {

          console.warn(
            "[House Mystery] clients.claim failed:",
            error
          );

        }

      })()
    );

  }
);

/* =====================================================
FCM BACKGROUND MESSAGE
===================================================== */

if (messaging) {

  messaging.onBackgroundMessage(
    async payload => {

      console.log(
        "[House Mystery] FCM background message:",
        payload
      );

      const notification =
        payload?.notification || {};

      const data =
        payload?.data || {};

      const title =
        notification.title ||
        data.title ||
        "🔔 House Mystery";

      const body =
        notification.body ||
        data.body ||
        "You have a new House Mystery alert.";

      const notificationType =
        data.notificationType ||
        "general";

      const tag =
        data.tag ||
        notification.tag ||
        (
          "house-mystery-" +
          notificationType +
          "-" +
          Date.now()
        );

      const requireInteraction =
        data.requireInteraction === true ||
        data.requireInteraction === "true";

      const renotify =
        data.renotify === false ||
        data.renotify === "false"
          ? false
          : true;

      const vibrate =
        notificationType === "call"
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
          ];

      const notificationData = {

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

      };

      /*
        When the server sends notification data,
        show it ourselves so the notification has
        the exact House Mystery behavior we want.
      */

      try {

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

            renotify,

            requireInteraction,

            vibrate,

            data:
              notificationData

          }
        );

      }
      catch(error) {

        console.error(
          "[House Mystery] Could not show FCM notification:",
          error
        );

      }

    }
  );

}

/* =====================================================
RAW WEB PUSH FALLBACK
===================================================== */

self.addEventListener(
  "push",
  event => {

    event.waitUntil(

      (async () => {

        let payload = {};

        try {

          if(event.data) {

            try {

              payload =
                event.data.json();

            }
            catch {

              payload = {

                body:
                  event.data.text()

              };

            }

          }

        }
        catch(error) {

          console.warn(
            "[House Mystery] Could not read push payload:",
            error
          );

          payload = {};

        }

        /*
          FCM messages are handled by the Firebase
          messaging handler above. This fallback is
          for normal Web Push payloads.
        */

        if(
          payload?.from ||
          payload?.fcmOptions ||
          payload?.collapseKey ||
          payload?.messageType === "push-received"
        ){

          return;

        }

        const notification =
          payload?.notification ||
          payload ||
          {};

        const data =
          payload?.data ||
          payload ||
          {};

        const title =
          notification.title ||
          data.title ||
          "🔔 House Mystery";

        const body =
          notification.body ||
          data.body ||
          "You have a new House Mystery alert.";

        const notificationType =
          notification.notificationType ||
          data.notificationType ||
          "general";

        const tag =
          notification.tag ||
          data.tag ||
          (
            "house-mystery-" +
            notificationType +
            "-" +
            Date.now()
          );

        const requireInteraction =
          notification.requireInteraction === true ||
          notification.requireInteraction === "true" ||
          data.requireInteraction === true ||
          data.requireInteraction === "true";

        const vibrate =
          notificationType === "call"
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
            ];

        await self.registration.showNotification(

          title,

          {

            body,

            icon:
              notification.icon ||
              data.icon ||
              "./icon-192.png",

            badge:
              notification.badge ||
              data.badge ||
              "./icon-192.png",

            tag,

            renotify:
              true,

            requireInteraction,

            vibrate,

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
      event.notification?.data ||
      {};

    let targetUrl =
      data.url ||
      "./";

    /*
      Preserve room code so opening the notification
      can take the player back into their room.
    */

    try {

      const url =
        new URL(
          targetUrl,
          self.location.origin
        );

      if(
        data.roomCode
      ){

        url.searchParams.set(
          "room",
          data.roomCode
        );

      }

      targetUrl =
        url.href;

    }
    catch(error) {

      console.warn(
        "[House Mystery] Could not build target URL:",
        error
      );

    }

    event.waitUntil(

      (async () => {

        try {

          const target =
            new URL(
              targetUrl,
              self.location.origin
            );

          const clientList =
            await self.clients.matchAll({

              type:
                "window",

              includeUncontrolled:
                true

            });

          /*
            First try to reuse an existing House Mystery
            window/tab.
          */

          for(
            const client
            of clientList
          ){

            try {

              const clientUrl =
                new URL(
                  client.url
                );

              if(
                clientUrl.origin ===
                target.origin
              ){

                if(
                  "navigate" in client &&
                  client.url !==
                    target.href
                ){

                  try {

                    await client.navigate(
                      target.href
                    );

                  }
                  catch(error) {

                    console.warn(
                      "[House Mystery] Client navigation failed:",
                      error
                    );

                  }

                }

                if(
                  "focus" in client
                ){

                  return client.focus();

                }

              }

            }
            catch(error) {

              console.warn(
                "[House Mystery] Could not inspect client:",
                error
              );

            }

          }

          /*
            No existing tab found.
            Open House Mystery.
          */

          if(
            self.clients.openWindow
          ){

            return self.clients.openWindow(
              target.href
            );

          }

        }
        catch(error) {

          console.error(
            "[House Mystery] Notification click failed:",
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
      "[House Mystery] Notification closed:",
      event.notification?.tag
    );

  }
);

/* =====================================================
MESSAGE FROM PAGE
===================================================== */

self.addEventListener(
  "message",
  event => {

    const type =
      event.data?.type;

    if(
      type ===
      "SKIP_WAITING"
    ){

      self.skipWaiting();

      return;

    }

    if(
      type ===
      "APP_READY"
    ){

      self.clients
        .claim()
        .catch(
          error =>
            console.warn(
              "[House Mystery] clients.claim failed:",
              error
            )
        );

    }

  }
);

/* =====================================================
UNHANDLED ERRORS
===================================================== */

self.addEventListener(
  "error",
  event => {

    console.error(
      "[House Mystery SW] Error:",
      event.error ||
      event.message
    );

  }
);

self.addEventListener(
  "unhandledrejection",
  event => {

    console.error(
      "[House Mystery SW] Unhandled rejection:",
      event.reason
    );

  }
);
