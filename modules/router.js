const path = require("path");
const jsonServer = require("json-server");

const router = jsonServer.router(path.join(__dirname, "../data/db.json"));

module.exports = router;
