const jwt = require("./jwt");
const bodyParser = require("json-server").bodyParser;
const { findUserByEmail } = require("../data/helpers");

const authorize = (req, res, next) => {
  const token = req.headers.authorization;

  if (!token) {
    res.status(401).json({
      error: "Authorization error: token nonexistent, invalid, or expired",
    });
    return;
  }

  try {
    jwt.verifyToken(token);
    next();
  } catch (err) {
    res.status(401).json({
      error: "Authorization error: token nonexistent, invalid, or expired",
    });
  }
};

const checkUserCreds = (req, res, next) => {
  if (!(req.body.email && req.body.password && req.body.name)) {
    res.status(401).json({ error: "Missing required information" });
    return;
  }

  next();
};

const checkUserExists = (req, res, next) => {
  if (findUserByEmail(req.body.email)) {
    res.status(401).json({ error: "Email address already in use" });
    return;
  }

  next();
};

module.exports = { authorize, checkUserCreds, checkUserExists };
