const db = require("../models");
const User = db.user;
const Message = db.message;
const Channel = db.channel;
const ChannelUsers = db.channel_users;

exports.createChannel = (req, res) => {
    Channel.create({
        name: req.body.name
    }).then(channel => {
      console.log(req.body.users);
        ChannelUsers.create({
          channelId: channel.dataValues.id,
          userId: req.body.loggedUserId
        })
        req.body.users.forEach(userId => {
            ChannelUsers.create({
                channelId: channel.dataValues.id,
                userId: userId
            });
        });
        res.status(200).send(channel); 
    });
};


exports.getUsersFromChannel = (req, res) => {
    ChannelUsers.findAll({
        where: {
            channelId: req.body.channelId
        }
    }).then(users => {
        if(!users) {
            return res.status(404).send({message: "Aucun utilisateur n'a été trouvé dans ce channel."})
        }
        return res.status(200).send(users);
    });
};

exports.getChannels = (req, res) => {
    User.findOne({
    where: {
      username: req.username
    }
  })
    .then(user => {
      if (!user) {
        return res.status(404).send({ message: "Aucun utilisateur n'a été trouvé." });
      }
      user.getChannels().then(function(channels) {
        return res.status(200).send(channels);
      })
    });
};

exports.getChannel = (req, res) => {
    Channel.findByPk(req.params.channelId)
    .then(channel => {
      if (!channel) {
        return res.status(404).send({ message: "Aucun channel n'a été trouvé." });
      }
        return res.status(200).send(channel);
    })
};