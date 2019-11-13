const Server = require('./server');

(async () => {
  let server = new Server();
  await server.init();

  server.start();
})();