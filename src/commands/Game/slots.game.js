const { SlashCommandBuilder } = require("discord.js");
const { Slots } = require("discord-gamecord");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("slots")
    .setDescription("Play the Slot Machine game"),

  async execute(interaction) {
    const { guild, client, member } = interaction;

    // Fetch the bot member to get its highest role color
    const botMember = await guild.members.fetch(client.user.id);
    const botColor = botMember.roles.highest.hexColor || "#5865F2";
    const displayName = member.displayName;

    // Create a new instance of the Slots game
    const Game = new Slots({
      message: interaction,
      isSlashGame: true,
      embed: {
        title: `${displayName}'s Slot Machine`,
        color: botColor,
      },
      slots: ["🍇", "🍊", "🍋", "🍌"],
    });

    // Start the game
    Game.startGame();
  },
};
