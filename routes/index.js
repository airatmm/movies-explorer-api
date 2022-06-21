const router = require('express').Router();
const usersRouter = require('./users');
const moviesRouter = require('./movies');
const { login, register, signout } = require('../controllers/users');
const { validateUser, validateLogin } = require('../validator/validator');
const auth = require('../middlewares/auth');

router.post('/signin', validateLogin, login);
router.post('/signup', validateUser, register);
router.get('/signout', signout);

router.use(auth); // защищаем все роуты ниже, нет доступа неавторизованным пользователям

router.use('/users', usersRouter);
router.use('/movies', moviesRouter);

module.exports = router;
