const http = require("http");

const server = http.createServer((req, res) => {
  res.end("Voilà la réponse  qui vient du serveur");
});

server.listen(process.env.PORT || 3000);
