const Hapi = require('hapi');
const mongoose = require('mongoose');
mongoose
  .connect('mongodb://localhost/hapidb', {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => console.log('mongoDB connected...'))
  .catch(err => console.log(err));

// Create Task Model
const Task = mongoose.model('Task', { text: String });
// To add initial data:
// Go to cmd -> MongoDB -> bin folder -> mongo
// show dbs, use hapidb, db.createCollection('tasks');, db.tasks.insert({text: 'My task 1'});, db.tasks.find()

const init = async () => {

  // Init Server
  const server = Hapi.server({
    port: 8000,
    host: 'localhost'
  });

  await server.register(require('inert')); // Serving Static Files
  await server.register(require('vision')); // Vision Templates

  // Home Route
  server.route({
    method: 'GET',
    path: '/',
    handler: (request, h) => {
      // return 'Hello World!';
      return h.view('index', {
        name: 'Nikolas' 
      });
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

  // Tasks Route
  server.route({
    method: 'GET',
    path: '/tasks',
    handler: async (req, h) => {
      let tasks = await Task.find((err, tasks) => {
        console.log(tasks);
      });

      // let tasks = [
      //         { text: 'task one' },
      //         { text: 'task two' },
      //         { text: 'task three' }
      //       ];

      return h.view('tasks', {
        tasks: tasks
      });
    }
  });

  //Post Task Route
  server.route({
    method: 'POST',
    path: '/tasks',
    handler: async (req, h) => {
      let text = req.payload.text; // html form -> name: text
      let newTask = new Task({ text: text });
      await newTask.save((err, task) => {
        if (err) 
          return console.log(err);
      });

      return h.redirect().location('tasks');
    }
  })

  // Vision Templates
  server.views({
    engines: {
      html: require('handlebars')
    },
    relativeTo: __dirname, // __dirname = the current dir -> path: __dirname + '/views'
    path: 'views'
  });

  // Start Server
  await server.start();
  console.log(`Server is running on: ${server.info.uri}`);

};

init().catch(err => console.log(err));