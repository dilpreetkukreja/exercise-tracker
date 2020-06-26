const User = require('../models/user');
const Exercise = require('../models/exercise');
const mongodb = require('mongodb');
const ObjectId = mongodb.ObjectId;
const moment = require('moment');

exports.addExercise = (req, res, next) => {
  const userId = req.body.userId;
  const description = req.body.description;
  const duration = req.body.duration;
  const date = req.body.date;
  let exercise;
  const hex = /[0-9A-Fa-f]{6}/g;

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
      `No such user with User Id: "${userId}" exists in database, try again with existing User Id!`
    );
  } else {
    if (date) {
      let output;
      if (isNaN(date)) {
        let datetemp = new Date(date);
        if (datetemp == 'Invalid Date') {
          return res.send('Enter Valid date');
        } else {
          output = datetemp.toDateString().slice(0, 15);
        }
      } else {
        datetemp = new Date(+date);
        if (datetemp == 'Invalid Date') {
          return res.send('Enter Valid date');
        } else {
          if (date.length <= 6) {
            output = new Date(date).toDateString().slice(0, 15);
          } else {
            output = new Date(+date).toDateString().slice(0, 15);
          }

          //   return res.send('Enter Valid date');
        }
      }

      exercise = new Exercise({
        userId: userId,
        description: description,
        duration: duration,
        date: output,
      });
    } else {
      //adding default current date by database itself
      exercise = new Exercise({
        userId: userId,
        description: description,
        duration: duration,
        date: Date.now().toDateString().slice(0, 15),
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
