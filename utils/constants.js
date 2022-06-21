const DUPLICATE_MONGOOSE_ERROR_CODE = 11000;
const SALT_ROUNDS = 10;
const messageSignout = 'Выход';
const messageHandleError = 'На сервере произошла ошибка';
const messageValidationLinkError = 'Некорректная ссылка';
const messageValidationEmailError = 'Некорректный E-mail';
const messageBadRequestError = 'Поля должны быть заполнены';
const messageBadRequestErrorMoviesId = 'Некорректный id фильма';
const messageConflictError = 'Пользователь с таким e-mail уже существует';
const messageForbiddenErrorMovies = 'Нельзя удалить чужие фильмы';
const messageNotFoundErrorGeneral = 'Ой! Такой страницы нет';
const messageNotFoundErrorMovies = 'Фильмы не найдены';
const messageNotFoundErrorMoviesId = 'Нет фильма с таким id';
const messageNotFoundErrorUserId = 'Пользователь по заданному id отсутствует в базе';
const messageUnauthorizedErrorAuth = 'Необходима авторизация';
const messageUnauthorizedErrorGeneral = 'Неправильные email или пароль';

module.exports = {
  DUPLICATE_MONGOOSE_ERROR_CODE,
  SALT_ROUNDS,
  messageHandleError,
  messageValidationLinkError,
  messageValidationEmailError,
  messageBadRequestError,
  messageBadRequestErrorMoviesId,
  messageConflictError,
  messageForbiddenErrorMovies,
  messageNotFoundErrorGeneral,
  messageNotFoundErrorMovies,
  messageNotFoundErrorMoviesId,
  messageNotFoundErrorUserId,
  messageUnauthorizedErrorAuth,
  messageUnauthorizedErrorGeneral,
  messageSignout,
};
