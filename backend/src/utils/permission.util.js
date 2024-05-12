module.exports = {
  isPermission: (permissions, value) => {
    return permissions.find((item) => item.value === value);
  },
};
