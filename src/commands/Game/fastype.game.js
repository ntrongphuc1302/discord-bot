const { SlashCommandBuilder } = require("discord.js");
const { FastType } = require("discord-gamecord");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("fasttype")
    .setDescription("Play a Fast Type game"),

  async execute(interaction) {
    const { guild, client, member } = interaction;

    const botMember = await guild.members.fetch(client.user.id);
    const botColor = botMember.roles.highest.hexColor || "#5865F2";
    const displayName = member.displayName;

    const Game = new FastType({
      message: interaction,
      isSlashGame: true,
      embed: {
        title: `${displayName}'s Fast Type Game`,
        color: botColor,
        description: "You have {time} seconds to type the sentence below.",
      },
      timeoutTime: 60000,
      sentence: "Some really cool sentence to fast type.",
      winMessage:
        "You won! You finished the type race in {time} seconds with a WPM of {wpm}.",
      loseMessage: "You lost! You didn't type the correct sentence in time.",
    });

    Game.startGame();
  },
};
