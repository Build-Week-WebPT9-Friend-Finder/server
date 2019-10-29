const fs = require("fs");
const path = require("path");
const jsonServer = require("json-server");

const server = require("../modules/server");
const router = require("../modules/router");
const jwt = require("../auth/jwt");
const hash = require("../auth/hash");
const {
  authorize,
  checkUserCreds,
  checkUserExists,
} = require("../auth/middleware");
const db = require("../data/db.json");
const {
  findUserById,
  editUserInfo,
  fetchUserHobbies,
  editUserHobbies,
  fetchUserFriends,
  editUserFriends,
} = require("../data/helpers");
const { filterOutPassword, getSplitPathId } = require("../modules/utils");
const { addUser } = require("../auth/helpers");

const bodyParser = jsonServer.bodyParser;
const middlewares = jsonServer.defaults();

server.use(middlewares);
server.use(bodyParser);

/* Auth router */
// Handle login attempt
server.post("/auth/login", (req, res) => {
  const { email, password } = req.body;

  const user = jwt.isAuthenticated({ email, password });

  if (!user) {
    res.status(401).json({ error: "Email or password is incorrect" });
    return;
  }

  const token = jwt.createToken({ email, password });
  res.status(200).json({ token, user, user_id: user.id });
});

// Handle register new user
server.post("/auth/register", checkUserCreds, checkUserExists, (req, res) => {
  const user = {
    name: req.body.name,
    email: req.body.email,
    password: hash.make(req.body.password),
  };

  addUser(user)
    .then(data => {
      res.status(201).json(data);
    })
    .catch(error => {
      console.log(error);
      res
        .status(error.response.status)
        .json({ error: error.response.data.error });
    });
});

// Auth token verification
server.use(/^(?!\/auth)/, authorize);

/* User router */
// Get all users
server.get("/user", (req, res) => res.status(200).json(db.users));

// Get single user - don't really need anymore but it's here so might as well use it
server.get("/users/:id", (req, res) => {
  const id = getSplitPathId(req.path);
  res.status(200).json(findUserById(id));
});

// Edit user's info
server.put("/users/:id", (req, res) => {
  const id = getSplitPathId(req.path);
  editUserInfo(id, req.body)
    .then(data => res.status(200).json(data))
    .catch(error =>
      res.status(error.response.status).json(error.response.data.error),
    );
});

// Get hobbies
server.get("/users/:id/hobbies", (req, res) => {
  const id = getSplitPathId(req.path);
  const hobbies = fetchUserHobbies(id);
  res.status(200).json(hobbies);
});

// Edit hobbies
server.put("/users/:id/hobbies", (req, res) => {
  const id = getSplitPathId(req.path);
  editUserHobbies(id, req.body.hobbies)
    .then(data => res.status(200).json(data))
    .catch(error =>
      res.status(error.response.status).json(error.response.data.error),
    );
});

// Get friends
server.get("/users/:id/friends", (req, res) => {
  const id = getSplitPathId(req.path);
  const friends = fetchUserFriends(id);
  res.status(200).json(friends);
});

// Edit friends
server.put("/users/:id/friends", (req, res) => {
  const id = getSplitPathId(req.path);
  editUserFriends(id, req.body.friends)
    .then(data => res.status(200).json(data))
    .catch(error => console.log(error));
});

server.use(router);

module.exports = server;
