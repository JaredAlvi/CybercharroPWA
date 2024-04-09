//Asignar nombre y versión de la cache
const CACHE_NAME='v1_cache_BCH_PWA';

//configuración de los ficheros a subir a la cache de la aplicación.
var urlsToCache= [
    './',
    './css/bootstrap.min.css',
    './css/tooplate-infinite-loop.css',
    './fontawesome-5.5/all.min.css',

    './img/catrina.png',
    './img/charro.gif',
    './img/eterno.gif',
    './img/huicho.gif',
    './img/infinite-loop-03.jpg',
    './img/logo-cybercharro.png',
    './img/neo-puebla.jpeg',
    './img/personajes-vertical.jpeg',
    './img/personajes.jpg',
    './img/robot.gif',
    './img/soldado.gif',
    './img/soul-stuidos.png',
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