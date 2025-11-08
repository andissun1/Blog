const express = require('express');
const { register, login } = require('../controllers/user');
const mapUser = require('../helpers/mapUser');

const router = express.Router({ mergeParams: true });

router.post('/register', async (req, res) => {
  try {
    const { user, token } = await register(req.body.login, req.body.password);

    res
      .cookie('token', token, { httpOnly: true })
      .send({ errors: null, user: mapUser(user) });
  } catch (error) {
    res.send({ error: error.message || 'Неизвестная ошибка' });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { user, token } = await login(req.body.login, req.body.password);

    res
      .cookie('token', token, { httpOnly: true })
      .send({ errors: null, user: mapUser(user) });
  } catch (error) {
    res.send({ error: error.message || 'Неизвестная ошибка' });
  }
});

router.post('/logout', async (req, res) => {
  res.cookie('token', '', { httpOnly: true }).send({});
});

module.exports = router;
