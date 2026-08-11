const CACHE = "hotel-murder-v1";

const APP_SHELL = [
  "./",
  "./index.html",
  "./manifest.json"
];

self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE)
      .then(cache => cache.addAll(APP_SHELL))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys()
      .then(keys =>
        Promise.all(
          keys
            .filter(key => key !== CACHE)
            .map(key => caches.delete(key))
        )
      )
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", event => {

  if(event.request.method !== "GET"){
    return;
  }

  event.respondWith(

    fetch(event.request)

      .then(response => {

        const copy =
          response.clone();

        caches.open(CACHE)
          .then(cache =>
            cache.put(
              event.request,
              copy
            )
          );

        return response;

      })

      .catch(() =>
        caches.match(
          event.request
        )
      )

  );

});


/*
  Background Web Push receiver.

  This is ready for push messages,
  but a push message must actually be
  sent by a server/push service.
*/

self.addEventListener(
  "push",
  event => {

    let data = {};

    try {
      data =
        event.data
          ? event.data.json()
          : {};
    }
    catch(e){}

    const title =
      data.title ||
      "📞 Hotel Murder";

    const body =
      data.body ||
      "You have a game call.";

    const tag =
      data.tag ||
      (
        "hotel-murder-" +
        Date.now()
      );


    event.waitUntil(

      self.registration
        .showNotification(
          title,
          {
            body,
            tag,
            renotify:true
          }
        )

    );

  }
);


/*
  Open/focus the app when
  the notification is tapped.
*/

self.addEventListener(
  "notificationclick",
  event => {

    event.notification.close();


    event.waitUntil(

      clients
        .matchAll({
          type:"window",
          includeUncontrolled:true
        })

        .then(list => {

          for(
            const client
            of list
          ){

            if(
              "focus"
              in client
            ){

              return client.focus();

            }

          }


          if(
            clients.openWindow
          ){

            return clients.openWindow(
              "./"
            );

          }

        })

    );

  }
);