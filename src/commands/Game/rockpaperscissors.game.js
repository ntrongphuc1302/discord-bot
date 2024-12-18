const { SlashCommandBuilder } = require("discord.js");
const { RockPaperScissors } = require("discord-gamecord");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("rockpaperscissors")
    .setDescription("Play Rock Paper Scissors game")
    .addUserOption((option) =>
      option
        .setName("opponent")
        .setDescription("The player you want to challenge")
        .setRequired(true)
    ),

  async execute(interaction) {
    const { options, guild, client, member } = interaction;
    const opponent = options.getUser("opponent");

    const botMember = await guild.members.fetch(client.user.id);
    const botColor = botMember.roles.highest.hexColor || "#5865F2";
    const displayName = member.displayName;

    const Game = new RockPaperScissors({
      message: interaction,
      isSlashGame: true,
      opponent: opponent,
      embed: {
        title: `${displayName}'s Rock Paper Scissors`,
        color: botColor,
        description: "Press the button below to choose your move!",
      },
      buttons: {
        rock: "Rock",
        paper: "Paper",
        scissors: "Scissors",
      },
      emojis: {
        rock: "🪨",
        paper: "📄",
        scissors: "✂️",
      },
      mentionUser: true,
      timeoutTime: 60000,
      buttonStyle: "PRIMARY",
      pickMessage: "You choose {emoji}",
      winMessage: "GG, **{player}** won the game!",
      tieMessage: "It's a tie!",
      timeoutMessage: "The game went unfinished! No one won.",
      playerOnlyMessage: `Only {player} and {opponent} can use the buttons!`,
    });
    Game.startGame();
  },
};
