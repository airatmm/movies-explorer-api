const router = require('express').Router();

const {
  getSavedMovies,
  createMovie,
  deleteMovie,
} = require('../controllers/movies');

const {
  validateCreateMovie,
  validateMovieDelete,
} = require('../validator/validator');

router.get('/', getSavedMovies);
router.post('/', validateCreateMovie, createMovie);
router.delete('/movieId', validateMovieDelete, deleteMovie);

module.exports = router;
