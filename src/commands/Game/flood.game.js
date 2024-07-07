const { SlashCommandBuilder } = require("discord.js");
const { Flood } = require("discord-gamecord");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("flood")
    .setDescription("Play a Flood game"),

  async execute(interaction) {
    const { guild, client, member } = interaction;

    const botMember = await guild.members.fetch(client.user.id);
    const botColor = botMember.roles.highest.hexColor || "#5865F2";
    const displayName = member.displayName;

    const Game = new Flood({
      message: interaction,
      isSlashGame: true,
      embed: {
        title: `${displayName}'s Flood Game`,
        color: botColor,
      },
      difficulty: 13,
      timeoutTime: 60000,
      buttonStyle: "PRIMARY",
      emojis: ["🟥", "🟦", "🟧", "🟪", "🟩"],
      winMessage: "You won! You took **{turns}** turns.",
      loseMessage: "You lost! You took **{turns}** turns.",
      playerOnlyMessage: "Only {player} can use these buttons.",
    });

    Game.startGame();
  },
};
