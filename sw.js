const CACHE_NAME = "tivoli-mystery-v4";


self.addEventListener(
  "install",
  event => {

    self.skipWaiting();

  }
);


self.addEventListener(
  "activate",
  event => {

    event.waitUntil(
      self.clients.claim()
    );

  }
);


/* =====================================================
WEB PUSH
===================================================== */

self.addEventListener(
  "push",
  event => {

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
        catch{

          try{

            data = {

              body:
                event.data.text()

            };

          }
          catch{

            data = {};

          }

        }


        const title =
          data.title ||
          "🔔 Tivoli Mystery";


        const body =
          data.body ||
          "You have a new Tivoli Mystery alert.";


        await self.registration.showNotification(

          title,

          {

            body,

            icon:
              "./icon-192.png",

            badge:
              "./icon-192.png",

            tag:
              data.tag ||
              "tivoli-push",

            renotify:
              data.renotify !== false,

            requireInteraction:
              Boolean(
                data.requireInteraction
              ),

            vibrate:
              data.vibrate ||
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

      clients
        .matchAll({

          type:
            "window",

          includeUncontrolled:
            true

        })

        .then(
          clientList => {

            for(
              const client
              of clientList
            ){

              try{

                const clientUrl =
                  new URL(
                    client.url
                  );


                const target =
                  new URL(
                    targetUrl,
                    self.location.origin
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
              catch{

                /* ignore */

              }

            }


            if(
              clients.openWindow
            ){

              return clients.openWindow(
                targetUrl
              );

            }

          }
        )

    );

  }
);


/* =====================================================
PAGE -> SERVICE WORKER
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