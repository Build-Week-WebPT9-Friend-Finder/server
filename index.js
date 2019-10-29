require("dotenv").config();
const server = require("./api/server");

const port = process.env.LISTEN_PORT || 3001;

server.listen(port, error => {
  if (error) console.error(error);

  console.info(`\n==> Listening on port ${port}.\n`);
});
