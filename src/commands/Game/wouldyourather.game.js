const { SlashCommandBuilder } = require("discord.js");
const { WouldYouRather } = require("discord-gamecord");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("wouldyourather")
    .setDescription("Play Would You Rather game"),

  async execute(interaction) {
    try {
      const { guild, client, member } = interaction;

      const botMember = await guild.members.fetch(client.user.id);
      const botColor = botMember.roles.highest.hexColor || "#5865F2";
      const displayName = member.displayName;

      const Game = new WouldYouRather({
        message: interaction,
        isSlashGame: true,
        embed: {
          title: "Would You Rather",
          color: botColor,
        },
        buttons: {
          option1: "Option 1",
          option2: "Option 2",
        },
        timeoutTime: 60000,
        errMessage: "Unable to fetch question data! Please try again.",
        playerOnlyMessage: "Only {player} can use these buttons.",
      });

      Game.startGame();
    } catch (error) {
      console.error("Error executing Would You Rather game command:", error);
      interaction.reply({
        content: "There was an error while starting the game.",
        ephemeral: true,
      });
    }
  },
};
