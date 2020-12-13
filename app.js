const Hapi = require('hapi');

const init = async () => {

  // Init Server
  const server = Hapi.server({
    port: 8000,
    host: 'localhost'
  });

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

  // Start Server
  await server.start();
  console.log(`Server is running on ${server.info.uri}`);

};

init().catch(err => console.log(err));