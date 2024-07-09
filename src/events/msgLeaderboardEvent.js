const lb = require("../Schemas/msgleaderboard");

module.exports = {
  name: "messageCreate",
  async execute(message, client) {
    if (message.author.bot) return;
    var data = await lb.findOne({
      Guild: message.guild.id,
      User: message.author.id,
    });
    if (!data) {
      await lb.create({
        Guild: message.guild.id,
        User: message.author.id,
        Messages: 1,
      });
    } else {
      var updateMessage = data.Messages + 1;
      await lb.deleteOne({ Guild: message.guild.id, User: message.author.id });
      await lb.create({
        Guild: message.guild.id,
        User: message.author.id,
        Messages: updateMessage,
      });
    }
  },
};
