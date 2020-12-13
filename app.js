const Hapi = require('hapi');

const init = async () => {

  // Init Server
  const server = Hapi.server({
    port: 8000,
    host: 'localhost'
  });

  await server.register(require('inert')); // Serving Static Files

  // Home Route
  server.route({
    method: 'GET',
    path: '/',
    handler: (request, h) => {
      return 'Hello World!';
    }
  });

  // Dynamic Route
  server.route({
    method: 'GET',
    path: '/user/{name}',
    handler: (req, h) => {
      return `Hello ${req.params.name}`;
    }
  });

  // Serving Static Files
  server.route({
    method: 'GET',
    path: '/about',
    handler: (req, h) => {
      return h.file('./public/about.html');
    }
  });

  server.route({
    method: 'GET',
    path: '/image',
    handler: (req, h) => {
      return h.file('./public/hapijs.jpeg')
    }
  });

  // Start Server
  await server.start();
  console.log(`Server is running on ${server.info.uri}`);

};

init().catch(err => console.log(err));