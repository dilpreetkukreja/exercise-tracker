const User = require('../models/user');
const Exercise = require('../models/exercise');
const mongodb = require('mongodb');
const ObjectId = mongodb.ObjectId;

exports.addExercise = (req, res, next) => {
  const userId = req.body.userId;
  const description = req.body.description;
  const duration = req.body.duration;
  const date = req.body.date;
  let exercise;
  const hex = /[0-9A-Fa-f]{6}/g;

  console.log(new Date(req.body.date).toUTCString());

  if (description == '') {
    return res.send('Path "description" is required.');
  }
  if (duration == '') {
    return res.send('Path "duration" is required.');
  } else if (isNaN(duration)) {
    return res.send('Please enter valid duration in minutes');
  }

  // if (!hex.test(userId)) {}

  if (!ObjectId.isValid(userId)) {
    return res.send(
      `No such user with User Id: ${userId} exists in database, try again with existing User Id!`
    );
  } else {
    if (date) {
      if (new Date(req.body.date).toUTCString() != 'Invalid Date') {
        //adding date added by user
        exercise = new Exercise({
          userId: userId,
          description: description,
          duration: duration,
          date: new Date(req.body.date),
        });
      } else {
        return res.send('Please enter valid date with format "YYYY-MM-DD".');
      }
    } else {
      //adding default current date by database itself
      exercise = new Exercise({
        userId: userId,
        description: description,
        duration: duration,
        date: new Date(),
      });
    }

    User.findById({
      _id: userId,
    })
      .then((userData) => {
        if (!userData) {
          return res.send(
            `No such user with User Id: ${userId} exists in database, try again with existing User Id!`
          );
        }
        exercise
          .save()
          .then((exerciseData) => {
            const username = userData.username;
            res.json({
              _id: userId,
              username: username,
              date: exerciseData.date,
              duration: exerciseData.duration,
              description: exerciseData.description,
            });
          })
          .catch((err) => console.log(err));
      })
      .catch((err) => console.log(err));
  }
};
