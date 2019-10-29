const bcrypt = require("bcrypt");
const saltRounds = 12;

const make = password => bcrypt.hashSync(password, saltRounds);

const verify = (password, hashedPassword) =>
  bcrypt.compareSync(password, hashedPassword);

module.exports = { make, verify };
