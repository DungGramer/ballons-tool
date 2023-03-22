// Create Service Worker
self.addEventListener("install", function (event) {
  console.log("Service Worker installing.");
  // Perform install steps
});

self.addEventListener("activate", function (event) {
  console.log("Service Worker activating.");
});

self.addEventListener("fetch", function (event) {
  console.log("Service Worker fetching.");
});

// Register Service Worker
if ("serviceWorker" in navigator) {
  navigator.serviceWorker
    .register("/sw.js")
    .then(function (registration) {
      // Registration was successful
      console.log(
        "ServiceWorker registration successful with scope: ",
        registration.scope
      );
    })
    .catch(function (err) {
      // registration failed :(
      console.log("ServiceWorker registration failed: ", err);
    });
}

// Unregister Service Worker
if ("serviceWorker" in navigator) {
  navigator.serviceWorker.getRegistrations().then(function (registrations) {
    for (let registration of registrations) {
      registration.unregister();
    }
  });
}
