const { User, Role, Permission } = require("../models/index");
module.exports = (value) => {
  return async (req, res, next) => {
    //Lấy danh sách quyền của user đang đăng nhập
    const userId = req.user.id;
    const user = await User.findByPk(userId, {
      include: {
        model: Role,
        as: "roles",
        include: {
          model: Permission,
          as: "permissions",
        },
      },
    });
    const permissions = []; //Chứa tên các permissions của user đang đăng nhập
    if (user.roles.length) {
      user.roles.forEach((role) => {
        role.permissions.forEach((permission) => {
          !permissions.includes(permission.value) &&
            permissions.push(permission.value);
        });
      });
    }

    //Kiểm tra quyền
    if (!permissions.includes(value)) {
      return next(new Error("No permission."));
    }

    //Viết hàm kiểm tra quyền bất kỳ
    req.user.can = (name) => {
      return permissions.includes(name);
    };

    next();
  };
};

//Gọi middleware --> Gọi theo kiểu callback
