const User = require('../models/user');
const Exercise = require('../models/exercise');

exports.createUser = (req, res, next) => {
  const username = req.body.username;
  if (username == '') {
    return res.send('Username is required');
  }
  const user = new User({
    username: username,
  });
  user
    .save()
    .then((userData) => {
      console.log('User saved to database!', userData);
      res.json({
        _id: userData._id,
        username: userData.username,
      });
    })
    .catch((err) => console.log(err));
};

exports.fetchUsers = (req, res, next) => {
  User.find()
    .then((users) => {
      res.send(users);
    })
    .catch((err) => console.log(err));
};

exports.fetchUserLog = (req, res, next) => {
  const userId = req.query.userId;
  console.log(userId);
  User.findById({
    _id: userId,
  })
    .then((userData) => {
      if (!userData) {
        return res.send(`No such user with User Id: ${userId}`);
      }
      Exercise.find(
        {
          userId: userId,
        },
        'description duration date -_id'
      )
        .then((exerciseData) => {
          //console.log(exerciseData);
          res.json({
            userId: userId,
            username: userData.username,
            count: exerciseData.length,
            log: exerciseData,
          });
        })
        .catch((err) => console.log(err));
    })
    .catch((err) => console.log(err));
};
