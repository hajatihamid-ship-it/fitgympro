const express = require('express');
const router = express.Router();
const workoutController = require('../controllers/workoutController');
const auth = require('../middleware/auth');

// @route   POST api/workouts
// @desc    Create a new workout
// @access  Private
router.post('/', auth, workoutController.createWorkout);

// @route   GET api/workouts
// @desc    Get all workouts for a user
// @access  Private
router.get('/', auth, workoutController.getWorkouts);

// @route   PUT api/workouts/:id
// @desc    Update a workout
// @access  Private
router.put('/:id', auth, workoutController.updateWorkout);

// @route   DELETE api/workouts/:id
// @desc    Delete a workout
// @access  Private
router.delete('/:id', auth, workoutController.deleteWorkout);

module.exports = router;
