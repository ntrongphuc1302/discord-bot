const { SlashCommandBuilder } = require("discord.js");
const { TwoZeroFourEight } = require("discord-gamecord");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("2048")
    .setDescription("Play 2048 game"),

  async execute(interaction) {
    try {
      const { client, guild, member } = interaction;
      const botMember = await guild.members.fetch(client.user.id);
      const botColor = botMember.roles.highest.hexColor || "#5865F2";
      const displayName = member.displayName;

      const Game = new TwoZeroFourEight({
        message: interaction,
        isSlashGame: true,
        embed: {
          title: `${displayName}'s 2048 Game`,
          color: botColor,
        },
        emojis: {
          up: "⬆️",
          down: "⬇️",
          left: "⬅️",
          right: "➡️",
        },
        timeoutTime: 60000,
        buttonStyle: "PRIMARY",
        playerOnlyMessage: "Only {player} can use these buttons.",
      });

      await Game.startGame();
    } catch (error) {
      console.error(error);
      await interaction.reply({
        content: "There was an error trying to start the game.",
        ephemeral: true,
      });
    }
  },
};
