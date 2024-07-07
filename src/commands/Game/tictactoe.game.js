const { SlashCommandBuilder } = require("discord.js");
const { TicTacToe } = require("discord-gamecord");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("tictactoe")
    .setDescription("Play Tic Tac Toe with another user")
    .addUserOption((option) =>
      option
        .setName("opponent")
        .setDescription("The user to play against")
        .setRequired(true)
    ),

  async execute(interaction) {
    const { guild, client, user } = interaction;
    const opponent = interaction.options.getUser("opponent");

    // Fetch the bot member to get its highest role color
    const botMember = await guild.members.fetch(client.user.id);
    const botColor = botMember.roles.highest.hexColor || "#5865F2";

    // Create a new instance of the TicTacToe game
    const Game = new TicTacToe({
      message: interaction,
      isSlashGame: true,
      opponent: opponent,
      embed: {
        title: "Tic Tac Toe",
        color: botColor,
        statusTitle: "Status",
        overTitle: "Game Over",
      },
      emojis: {
        xButton: "❌",
        oButton: "🔵",
        blankButton: "➖",
      },
      mentionUser: true,
      timeoutTime: 60000,
      xButtonStyle: "DANGER",
      oButtonStyle: "PRIMARY",
      turnMessage: "{emoji} | It's {player}'s turn.",
      winMessage: "{emoji} | **{player}** won the TicTacToe game!",
      tieMessage: "The game ended in a tie!",
      timeoutMessage: "The game ended due to inactivity!",
      playerOnlyMessage: "Only {player} and {opponent} can use these buttons.",
    });

    // Start the game
    Game.startGame();
  },
};
