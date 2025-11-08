const { verify } = require('../helpers/token');
const User = require('../models/User');

module.exports = async function (req, res, next) {
  const tokenData = verify(req.cookies.token);

  const user = await User.findOne({ _id: tokenData.id });

  if (!user) return res.send({ error: 'Пользователь не найден' });

  req.user = user;

  next();
};
