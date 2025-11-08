module.exports = function (user) {
  return {
    id: user.id,
    login: user.login,
    role_id: user.role_id,
    registedAt: user.createdAt,
  };
};
