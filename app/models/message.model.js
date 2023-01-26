module.exports = (sequelize, Sequelize) => {
    const Message = sequelize.define("messages", {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true
      },
      text: {
        type: Sequelize.text
      },
      timestamps: true,
    });
  
    return Message;
  };
  