const http = require("http");
const axios = require("axios");

const filterOutPassword = user =>
  Object.keys(user).reduce((obj, key) => {
    if (key !== "password") obj[key] = user[key];
    return obj;
  }, {});

const getSplitPathId = path => Number(path.trim("/").split("/")[2]);

module.exports = { filterOutPassword, getSplitPathId };
