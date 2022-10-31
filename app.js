// Setup basic express server
const express = require("express");
const path = require("path");
const app = express();
const server = require("http").createServer(app);
const io = require("socket.io")({
  path: "/",
  serveClient: false,
});
io.attach(server, {
  pingInterval: 10000,
  pingTimeout: 5000,
  cookie: false,
});
const port = process.env.PORT || 3000;
server.listen(port, () => {
  console.log("Server listening at port %d", port);
});

// Routing
app.use(express.static(path.join(__dirname, "public")));

require("./iologic")(io);
