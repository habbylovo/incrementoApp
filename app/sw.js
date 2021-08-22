//Asignar un nombre y versión al cache
const CACHE_NAME = 'AppV1',
urlsToCache = [  
  './',   
  // CSS 
  './../assets/css/style.css',  
  './../assets/template/dist/assets/css/sleek.css',  
  './../assets/template/dist/assets/plugins/ladda/ladda.min.css',  
  './../assets/template/dist/assets/plugins/toastr/toastr.min.css',
  './../assets/template/dist/assets/plugins/nprogress/nprogress.css',
  './../assets/template/dist/assets/plugins/select2/css/select2.min.css',
  './../assets/template/dist/assets/plugins/jvectormap/jquery-jvectormap-2.0.3.css',
  './../assets/template/dist/assets/plugins/daterangepicker/daterangepicker.css',
  './../assets/template/dist/assets/plugins/data-tables/datatables.bootstrap4.min.css', 
  './style/style.css',  
  './style/loading.css',
  './style/fonts.css',
  //JS 
  // './route.js',
  // './script.js',
  './../assets/js/extras.js',
  './../assets/js/seguridad/sha256.js',  
  './../assets/template/dist/assets/js/sleek.bundle.js',  
  './../assets/template/dist/assets/plugins/ladda/spin.min.js',
  './../assets/template/dist/assets/plugins/ladda/ladda.min.js',
  './../assets/template/dist/assets/plugins/charts/Chart.min.js',
  './../assets/template/dist/assets/plugins/jekyll-search.min.js',
  './../assets/template/dist/assets/plugins/jquery/jquery.min.js',
  './../assets/template/dist/assets/plugins/toastr/toastr.min.js',
  './../assets/template/dist/assets/plugins/nprogress/nprogress.js',
  './../assets/template/dist/assets/plugins/select2/js/select2.min.js',
  './../assets/template/dist/assets/plugins/daterangepicker/moment.min.js',
  './../assets/template/dist/assets/plugins/daterangepicker/daterangepicker.js',  
  './../assets/template/dist/assets/plugins/circle-progress/circle-progress.js', 
  './../assets/template/dist/assets/plugins/data-tables/jquery.datatables.min.js',
  './../assets/template/dist/assets/plugins/jquery-mask-input/jquery.mask.min.js',
  './../assets/template/dist/assets/plugins/slimscrollbar/jquery.slimscroll.min.js',  
  './../assets/template/dist/assets/plugins/data-tables/datatables.bootstrap4.min.js',  
  './../assets/template/dist/assets/plugins/jvectormap/jquery-jvectormap-2.0.3.min.js',
  './../assets/template/dist/assets/plugins/jvectormap/jquery-jvectormap-world-mill.js',
  './js/scriptdb.js',
  // MANIFEST
  './manifest.json',
  // IMAGENES
  './../assets/template/dist/assets/img/user/user.png',
  './../assets/template/dist/assets/img/logo_452.png',
  './../assets/template/dist/assets/img/logo_452.png',
  './../assets/template/dist/assets/img/user/user4.png',
  // VISTAS
  './login.html',
  // './welcome.html',
  './index.html',
  // MATERIAL DESIGN ICONS
  './style/materialdesign/materialdesignicons.min.css',
  './style/materialdesign/materialdesignicons.min.css.map',
  './style/fonts/materialdesignicons-webfont.eot',
  './style/fonts/materialdesignicons-webfont.ttf',
  './style/fonts/materialdesignicons-webfont.woff',
  './style/fonts/materialdesignicons-webfont.woff2',
  // FUENTES
  './style/fonts/KFOlCnqEu92Fr1MmEU9fABc4EsA.woff2',
  './style/fonts/KFOlCnqEu92Fr1MmEU9fBBc4.woff2',
  './style/fonts/KFOlCnqEu92Fr1MmEU9fBxc4EsA.woff2',
  './style/fonts/KFOlCnqEu92Fr1MmEU9fCBc4EsA.woff2',
  './style/fonts/KFOlCnqEu92Fr1MmEU9fChc4EsA.woff2',
  './style/fonts/KFOlCnqEu92Fr1MmEU9fCRc4EsA.woff2',
  './style/fonts/KFOlCnqEu92Fr1MmEU9fCxc4EsA.woff2',
  './style/fonts/KFOmCnqEu92Fr1Mu4mxK.woff2',
  './style/fonts/KFOmCnqEu92Fr1Mu4WxKOzY.woff2',
  './style/fonts/KFOmCnqEu92Fr1Mu5mxKOzY.woff2',
  './style/fonts/KFOmCnqEu92Fr1Mu72xKOzY.woff2',
  './style/fonts/KFOmCnqEu92Fr1Mu7GxKOzY.woff2',
  './style/fonts/KFOmCnqEu92Fr1Mu7mxKOzY.woff2',
  './style/fonts/KFOmCnqEu92Fr1Mu7WxKOzY.woff2'
]

// durante la fase de instalación, generalmente se almacena en caché los activos estáticos
self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {        
        return cache.addAll(urlsToCache)
          .then(() => self.skipWaiting())
      })
      .catch(err => console.log('Falló registro de cache', err))
  )
})

//cuando el navegador recupera una url
self.addEventListener('fetch', e => {
  //Responder ya sea con el objeto en caché o continuar y buscar la url real
  e.respondWith(
    caches.match(e.request)
      .then(res => {
        if (res) {
          //recuperar del cache
          return res
        }
        //recuperar de la petición a la url
        return fetch(e.request)
      })
  )
})

//una vez que se instala el SW, se activa y busca los recursos para hacer que funcione sin conexión
self.addEventListener('activate', e => {
  const cacheWhitelist = [CACHE_NAME]

  e.waitUntil(
    caches.keys()
      .then(cacheNames => {
        return Promise.all(
          cacheNames.map(cacheName => {
            //Eliminamos lo que ya no se necesita en cache
            if (cacheWhitelist.indexOf(cacheName) === -1) {
              return caches.delete(cacheName)
            }
          })
        )
      })
      // Le indica al SW activar el cache actual
      // .then(() => self.clients.claim())
  )
})