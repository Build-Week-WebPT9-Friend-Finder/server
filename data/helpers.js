const fs = require("fs");
const { join } = require("path");
const db = require("./db.json");

const readDb = async () => {
  const data = await fs.readFileSync(join(__dirname, "../data/db.json"), {
    encoding: "utf8",
  });

  return JSON.parse(data);
};

const writeDb = async data => {
  const json = JSON.stringify(data);
  fs.writeFileSync(join(__dirname, "../data/db.json"), json);

  return await JSON.parse(json);
};

const findUserById = id => db.users.find(user => id === user.id);

const findUserByLoginId = login_id =>
  db.users.find(user => login_id === user.login_id);

const findUserByEmail = email =>
  db.users.find(user => email.toLowerCase() === user.email.toLowerCase());

const editUserInfo = async (id, info) => {
  const db = await readDb();
  const idx = db.users.findIndex(u => u.id === id);
  const user = findUserById(id);
  const newInfo = {
    ...info,
    name: user.name,
    email: user.email,
    hobbies: fetchUserHobbies(id),
    friends: fetchUserFriends(id),
    login_id: user.login_id,
    id: user.id,
  };

  db.users[idx] = newInfo;

  const newDb = await writeDb(db);
  const newUser = newDb.users[id - 1];
  return newUser;
};

const fetchUserHobbies = id => {
  const user = findUserById(id);
  return user.hobbies;
};

const editUserHobbies = async (id, hobbies) => {
  const data = await readDb();
  const oldHobbies = fetchUserHobbies(id);
  const newHobbies = hobbies ? hobbies : "[]";
  const user = data.users.find(u => u.id === id);

  user.hobbies = JSON.parse(newHobbies);

  const newDb = await writeDb(data);
  const newUser = newDb.users.find(u => u.id === id);
  return newUser.hobbies;
};

const fetchUserFriends = id => {
  const user = findUserById(id);
  return user.friends;
};

const editUserFriends = async (id, friends) => {
  const data = await readDb();
  const oldFriends = fetchUserFriends(id);
  const newFriends = friends ? friends : "[]";
  const user = data.users.find(u => u.id === id);

  user.friends = JSON.parse(newFriends);

  const newDb = await writeDb(data);
  const newUser = newDb.users.find(u => u.id === id);
  return newUser.friends;
};

module.exports = {
  readDb,
  writeDb,
  findUserById,
  findUserByLoginId,
  findUserByEmail,
  editUserInfo,
  fetchUserHobbies,
  editUserHobbies,
  fetchUserFriends,
  editUserFriends,
};
