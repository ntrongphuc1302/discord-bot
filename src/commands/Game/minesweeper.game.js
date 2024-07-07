const { SlashCommandBuilder } = require("discord.js");
const { Minesweeper } = require("discord-gamecord");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("minesweeper")
    .setDescription("Play the Minesweeper game"),

  async execute(interaction) {
    const { guild, client, member } = interaction;

    // Fetch the bot member to get its highest role color
    const botMember = await guild.members.fetch(client.user.id);
    const botColor = botMember.roles.highest.hexColor || "#5865F2";
    const displayName = member.displayName;

    // Create a new instance of the Minesweeper game
    const Game = new Minesweeper({
      message: interaction,
      isSlashGame: true,
      embed: {
        title: `${displayName}'s Minesweeper`,
        color: botColor,
        description: "Click on the buttons to reveal the blocks except mines.",
      },
      emojis: { flag: "🚩", mine: "💣" },
      mines: 5,
      timeoutTime: 60000,
      winMessage: "You won the Game! You successfully avoided all the mines.",
      loseMessage: "You lost the Game! Beware of the mines next time.",
      playerOnlyMessage: "Only {player} can use these buttons.",
    });

    // Start the game
    Game.startGame();
  },
};
