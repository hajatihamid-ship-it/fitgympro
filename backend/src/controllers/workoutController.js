const Workout = require('../models/Workout');

// @desc    Create a new workout
// @route   POST api/workouts
// @access  Private
exports.createWorkout = async (req, res) => {
  const { date, exercises } = req.body;

  try {
    const newWorkout = new Workout({
      user: req.user.id,
      date,
      exercises,
    });

    const workout = await newWorkout.save();
    res.json(workout);

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// @desc    Get all workouts for a user
// @route   GET api/workouts
// @access  Private
exports.getWorkouts = async (req, res) => {
  try {
    const workouts = await Workout.find({ user: req.user.id }).sort({ date: -1 });
    res.json(workouts);

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// @desc    Update a workout
// @route   PUT api/workouts/:id
// @access  Private
exports.updateWorkout = async (req, res) => {
  const { date, exercises } = req.body;

  // Build workout object
  const workoutFields = {};
  if (date) workoutFields.date = date;
  if (exercises) workoutFields.exercises = exercises;

  try {
    let workout = await Workout.findById(req.params.id);

    if (!workout) return res.status(404).json({ msg: 'Workout not found' });

    // Make sure user owns workout
    if (workout.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'Not authorized' });
    }

    workout = await Workout.findByIdAndUpdate(
      req.params.id,
      { $set: workoutFields },
      { new: true }
    );

    res.json(workout);

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// @desc    Delete a workout
// @route   DELETE api/workouts/:id
// @access  Private
exports.deleteWorkout = async (req, res) => {
  try {
    let workout = await Workout.findById(req.params.id);

    if (!workout) return res.status(404).json({ msg: 'Workout not found' });

    // Make sure user owns workout
    if (workout.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'Not authorized' });
    }

    await Workout.findByIdAndRemove(req.params.id);

    res.json({ msg: 'Workout removed' });

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};
