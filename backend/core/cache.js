const connectRedis = require("../src/utils/redis.util");
module.exports = class {
  static async remember(key, seconds, callback) {
    if (typeof callback !== "function") {
      throw new Error("Callback must be a function");
    }
    const redis = await connectRedis();
    let result = await redis.get(key);
    if (!result) {
      result = await callback(); // Read from database
      await redis.set(key, JSON.stringify(result), { EX: seconds });
      return result;
    }
    return JSON.parse(result);
  }
};
