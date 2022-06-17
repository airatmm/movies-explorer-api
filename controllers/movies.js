const Movie = require('../models/movie');
const NotFoundError = require('../errors/NotFoundError');
const BadRequestError = require('../errors/BadRequestError');
const ForbiddenError = require('../errors/ForbiddenError');

const getSavedMovies = async (req, res, next) => {
  try {
    const movies = await Movie.find({ owner: req.user._id });
    if (!movies) {
      next(new NotFoundError('Фильмы не найдены'));
      return;
    }
    res.status(200).send(movies);
  } catch (err) {
    next(err);
  }
};

const createMovie = async (req, res, next) => {
  try {
    const {
      country,
      director,
      duration,
      year,
      description,
      image,
      trailerLink,
      thumbnail,
      movieId,
      nameRU,
      nameEN,
    } = req.body;
    const movie = new Movie({
      country,
      director,
      duration,
      year,
      description,
      image,
      trailerLink,
      thumbnail,
      owner: req.user._id,
      movieId,
      nameRU,
      nameEN,
    });
    await movie.save();
    await movie.populate('owner');
    res.status(201).send(movie);
  } catch (err) {
    if (err.name === 'ValidationError') {
      next(new BadRequestError('Поля должны быть заполнены'));
      return;
    }
    next(err);
  }
};

const deleteMovie = async (req, res, next) => {
  const { _id } = req.params;
  try {
    const movieById = await Movie.findById(_id);
    if (!movieById) {
      next(new NotFoundError('Нет фильма с таким id'));
      return;
    }
    if (!movieById.owner.equals(req.user._id)) {
      next(new ForbiddenError('Нельзя удалить чужие фильмы'));
      return;
    }
    const movieDelete = await Movie.findByIdAndDelete(movieById);
    res.status(200).send(movieDelete);
  } catch (err) {
    if (err.name === 'CastError') {
      next(new BadRequestError('Некорректный id фильма'));
      return;
    }
    next(err);
  }
};

module.exports = {
  getSavedMovies,
  createMovie,
  deleteMovie,
};
