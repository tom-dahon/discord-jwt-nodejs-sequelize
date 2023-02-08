const db = require("../models");
const Message = db.message;
const User = db.user;

exports.getMessagesFromChannel = (req, res) => {
    // Récupère tous les messages dont le channelId correspond au channelId passé dans le body
    Message.findAll({
        where: {
            channelId: req.params.channelId
        },
        order: [
            ['createdAt', 'ASC']
        ]
    }).then(messages => {
        if(!messages) {
            return res.status(404).send({message: "Aucun message n'a été trouvé."})
        }
        return res.status(200).send(messages);
    });
};

exports.sendMessage = (req, res) => { 
    // Créé un message avec un texte, un userId et un channelId passé dans le body, retourne le message
    Message.create({
        text: req.body.text,
        userId: req.body.userId,
        channelId: req.params.channelId 
    }).then(message => {
        return res.status(200).send(message);
    });
};

exports.deleteMessage = (req, res) => {
    // Trouve un message avec l'id passé dans le body, puis le supprime
    Message.findByPk(req.body.id).then(message => {
        if (!message) {
            return res.status(404).send({ message: "Aucun message n'a été trouvé." });
        }
        message.destroy();
        return res.status(200).send("Message supprimé");
    });
};

exports.getSender = (req, res) => {
    // Récupère le user qui a envoyé un message avec un userId passé dans le body
    User.findByPk(req.params.userId)
        .then(user => {
            if(!user) {
                return res.status(404).send({ message: "Aucun utilisateur n'a été trouvé" });
            }
            return res.status(200).send(user);
        });
};