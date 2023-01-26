const db = require("../models");
const User = db.user;
const Message = db.message;
const Channel = db.channel;

exports.createChannel = (req, res) => {
    Channel.create({
        name: req.body.name
    }).then(channel => {
        res.status(200).send(channel);
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

exports.getMessagesFromChannel = (req, res) => {
    Message.findAll({
        where: {
            channelId: req.params.channelId
        }
    }).then(messages => {
        if(!messages) {
            return res.status(404).send({message: "Aucun message n'a été trouvé."})
        }
        return res.status(200).send(messages);
    });
};

exports.sendMessage = (req, res) => { 
    Message.create({
        text: req.body.text,
        userId: req.body.userId,
        channelId: req.params.channelId 
    }).then(message => {
        return res.status(200).send(message);
    });
};