//Asignar nombre y versión de la cache
const CACHE_NAME='v1_cache_BCH_PWA';

//configuración de los ficheros a subir a la cache de la aplicación.
var urlsToCache= [
    './',
    './assets/main.css',
    './assets/image/imagen-1.webp',
    './assets/image/imagen-2.webp',
    './assets/image/imagen-3.webp',
    './assets/image/favicon-16.png',
    './assets/image/favicon-32.png',
    './assets/image/favicon-64.png',
    './assets/image/favicon-96.png',
    './assets/image/favicon-128.png',
    './assets/image/favicon-192.png',
    './assets/image/favicon-256.png',
    './assets/image/favicon-384.png',
    './assets/image/favicon-512.png',
    './assets/image/favicon-1024.png',

];

//Eventos del ServerWorker
//Evento Install
//se encarga de la instalacion del SW
//guarda en cache los recursos estáticos
//la variable self permite recoger del SW

self.addEventListener('install', e => {
    //utilizamos la variable del evento

    e.waitUntil(
        caches.open(CACHE_NAME)
              .then(cache => {
                //le mandamos los elementos que tenemos en el array
                return cache.addAll(urlsToCache)
                            .then(()=>{
                                self.skipWaiting();
                    })
                })
       .catch(err=>console.log('No se ha registrado el cache', err))
    );

});

//Evento activate

//este evento permite  que la aplicación funcione offline
self.addEventListener('activate',e => {
    const cacheWhitelist = [CACHE_NAME];

    //que el evento espere a que termine de ejecutar
    e.waitUntil(
        caches.keys()
            .then(cacheNames=>{
                return Promise.all(
                    cacheNames.map(cacheName => {
                    if(cacheWhitelist.indexOf(cacheName)== -1)
                    {
                        //borrar elementos que no se necesitan
                        return cache.delete(cacheName);
                    }

                })
             );
        })
        .then(()=> {
            self.clients.claim(); //activa la cache en el dispositivo.

        })
    );
})

//Evento fetch 
//consigue la información de internet... hace una consulta al backend
//cuando se salta de una pagina a otra pagina... por ejemplo
//checa si ya tiene los recursos en cache y sino los solicita.

self.addEventListener('fetch',e => {
    e.respondWith(
        caches.match(e.request)
            .then(res => {
                if(res){
                    //devuelvo datos desde cache
                    return res;
                }
                return fetch(e.request);
                //hago petición al servidor en caso de que no este en cache 
            })
    );
});