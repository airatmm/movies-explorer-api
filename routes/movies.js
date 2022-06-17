const moviesRouter = require('express').Router();

const {
  getSavedMovies,
  createMovie,
  deleteMovie,
} = require('../controllers/movies');

const {
  validateCreateMovie,
  validateMovieDelete,
} = require('../validator/validator');

moviesRouter.get('/', getSavedMovies);
moviesRouter.post('/', validateCreateMovie, createMovie);
moviesRouter.delete('/:_id', validateMovieDelete, deleteMovie);

module.exports = {
  moviesRouter,
};
