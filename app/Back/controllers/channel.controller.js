const db = require("../models");
const User = db.user;
const Message = db.message;
const Channel = db.channel;
const ChannelUsers = db.channel_users;

exports.createChannel = (req, res) => {
    Channel.create({
        name: req.body.name
    }).then(channel => {
        req.body.users.forEach(user => {
            console.log(user.id);
            ChannelUsers.create({
                channelId: channel.dataValues.id,
                userId: user.id
            });
        });
        res.status(200).send("OK"); 
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