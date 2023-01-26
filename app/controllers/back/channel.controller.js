const db = require("../../models");
const User = db.user;

exports.getChannels = (req, res) => {
    User.findOne({
    where: {
      username: req.username
    }
  })
    .then(user => {
      if (!user) {
        return res.status(404).send({ message: "User Not found." });
      }
      user.getChannels().then(function(channels) {
        return res.status(200).send(channels);
      })
    });
};