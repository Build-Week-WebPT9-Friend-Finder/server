const jwt = require("jsonwebtoken");
const key = process.env.JWT_SECRET_KEY;
const expiresIn = "2h";
const db = require("../data/db.json");
const { verify } = require("./hash");

const createToken = payload => jwt.sign(payload, key, { expiresIn });

const verifyToken = token => {
  jwt.verify(token, key, (err, decode) =>
    decode !== undefined ? decode : err,
  );
};

const isAuthenticated = ({ email, password }) => {
  const login = db.logins.find(user => user.email === email);

  if (!login) return null;

  return verify(password, login.password)
    ? db.users.find(user => login.id === user.login_id)
    : null;
};

module.exports = { createToken, verifyToken, isAuthenticated };
