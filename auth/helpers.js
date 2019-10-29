const fs = require("fs");
const { join } = require("path");

const addUser = async user => {
  const { email, password, name } = user;
  const db = fs.readFileSync(join(__dirname, "../data/db.json"), {
    encoding: "utf8",
  });
  const parsedDb = JSON.parse(db);

  parsedDb.logins = [
    ...parsedDb.logins,
    { id: parsedDb.logins.length + 1, email, password },
  ];

  fs.writeFileSync(
    join(__dirname, "../data/db.json"),
    JSON.stringify(parsedDb),
  );

  const newDb = fs.readFileSync(join(__dirname, "../data/db.json"), {
    encoding: "utf8",
  });
  const parsedNewDb = JSON.parse(newDb);
  const logins = [...parsedNewDb.logins];
  const login_id = logins[logins.length - 1].id;
  const user_id = logins.length;

  parsedNewDb.users = [
    ...parsedNewDb.users,
    {
      name,
      email,
      dob: "",
      gender: "",
      location: "",
      profile_img: "",
      bio: "",
      hobbies: [],
      friends: [],
      login_id,
      id: user_id,
    },
  ];

  fs.writeFileSync(
    join(__dirname, "../data/db.json"),
    JSON.stringify(parsedNewDb),
  );

  const finalDb = fs.readFileSync(join(__dirname, "../data/db.json"), {
    encoding: "utf8",
  });

  const finalDbParsed = JSON.parse(finalDb);

  return await finalDbParsed.users.find(user => user.id == user_id);
};

module.exports = { addUser };
