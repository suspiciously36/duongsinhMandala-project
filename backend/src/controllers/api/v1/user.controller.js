const { User } = require("../../../models/index");
const { successResponse, errorResponse } = require("../../../helpers/response");
const { Op } = require("sequelize");
const { string, object } = require("yup");
const bcrypt = require("bcrypt");
const connectRedis = require("../../../utils/redis.util");
const UserTransformer = require("../../../transformers/user.transformer");
const Cache = require("../../../../core/cache");
module.exports = {
  async index(req, res) {
    const redis = await connectRedis();

    const { sort = "id", order = "asc", status, q, page, limit } = req.query;
    const filter = {};
    if (status === "true" || status === "false") {
      filter.status = status === "true";
    }
    if (q) {
      filter[Op.or] = {
        name: {
          [Op.iLike]: `%${q}%`,
        },
        email: { [Op.iLike]: `%${q}%` },
      };
    }
    const options = {
      order: [[sort, order]],
      attributes: { exclude: "password" },
      where: filter,
    };
    if (Number.isInteger(+limit) && Number.isInteger(+page)) {
      const offset = (page - 1) * limit;
      options.limit = limit;
      options.offset = offset;
    }
    try {
      // const usersRedis = await redis.get("users-cache");
      // let count, users;
      // if (!usersRedis) {
      //   const result = await User.findAndCountAll(options);
      //   count = result.count;
      //   users = result.rows;
      //   await redis.set("users-cache", JSON.stringify(result), { EX: 10 });
      //   console.log("No-cache");
      // } else {
      //   const result = JSON.parse(usersRedis);
      //   count = result.count;
      //   users = result.rows;
      //   console.log("cache");
      // }

      const { rows: users, count } = await Cache.remember(
        "users-cache",
        10,
        () => {
          return User.findAndCountAll(options);
        }
      );
      return successResponse(res, 200, "Success", new UserTransformer(users), {
        count,
      });
    } catch (e) {
      return errorResponse(res, 500, "Server error.");
    }
  },
  async find(req, res) {
    const { id } = req.params;

    try {
      const user = await Cache.remember(`user_cache_${id}`, 10, () => {
        return User.findByPk(id);
      });
      if (!user) {
        return errorResponse(res, 404, "User not found.");
      }
      return successResponse(res, 200, "Success", user);
    } catch (e) {
      return errorResponse(res, 500, "Server error.");
    }
  },
  async store(req, res) {
    const schema = object({
      name: string().required("You must have a name"),
      email: string()
        .required("You must have an email")
        .email("Wrong email format")
        .test("check-unique", "Email already existed", async (value) => {
          const user = await User.findOne({ where: { email: value } });
          return !user;
        }),
      password: string().required("Please input password"),
      status: string().test(
        "check-status",
        "Status invalid",
        (value) => value === "true" || value === "false"
      ),
    });

    try {
      const body = await schema.validate(req.body, { abortEarly: false });

      const user = await User.create({
        name: body.name,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),
        status: body.status === "false",
      });
      return successResponse(res, 201, "Success", user);
    } catch (e) {
      const errors = Object.fromEntries(
        e.inner.map(({ path, message }) => [path, message])
      );
      return errorResponse(res, 400, "Bad Request", errors);
    }
  },
  update(req, res) {
    const method = req.method;
    // PUT
    if (method === "PUT") {
      const body = {
        name: null,
        email: null,
        password: null,
        status: null,
        ...req.body,
      };
    } else {
      // PATCH
      const body = req.body;
    }
  },
  delete(req, res) {},
};
