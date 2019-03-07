import User from '../models/user-model';
const router = require('express').Router();

router.post('/', (req, res) => {
  User.findById(req.body.id, (err, doc) => {
    if (err) {
      console.log('findById err: ', err);
      res.send({ noUser: true });
    }
    if (doc) {
      console.log('user found: ', doc);
      res.send(doc);
    }
  });
});

router.post('/reorder-urls', (req, res) => {
  const { id, urls } = req.body;
  User.findOneAndUpdate(
    { _id: id },
    { $set: { urls } },
    {
      new: true,
      runValidators: true,
    }
  ).then(updatedUser => {
    console.log('updatedUser: ', updatedUser);
    res.send(updatedUser);
  });
});

router.post('/remove-url', (req, res) => {
  const { urlId, userId } = req.body;
  User.findOneAndUpdate(
    { _id: userId },
    { $pull: { urls: urlId } },
    { new: true, runValidators: true }
  ).then(updatedUser => {
    console.log('updatedUser: ', updatedUser);
    res.send(updatedUser);
  });
});

module.exports = router;
