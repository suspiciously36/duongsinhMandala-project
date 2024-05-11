const { createClient } = require("redis");
module.exports = () => {
  return createClient()
    .on("error", (err) => {
      console.log("Redis Client Error", err);
    })
    .connect();
};
