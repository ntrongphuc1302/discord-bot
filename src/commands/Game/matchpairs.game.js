const { SlashCommandBuilder } = require("discord.js");
const { MatchPairs } = require("discord-gamecord");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("matchpairs")
    .setDescription("Play the Match Pairs game"),

  async execute(interaction) {
    const { guild, client, member } = interaction;

    // Fetch the bot member to get its highest role color
    const botMember = await guild.members.fetch(client.user.id);
    const botColor = botMember.roles.highest.hexColor || "#5865F2";
    const displayName = member.displayName;

    // Create a new instance of the Match Pairs game
    const Game = new MatchPairs({
      message: interaction,
      isSlashGame: true,
      embed: {
        title: `${displayName}'s Match Pairs`,
        color: botColor,
        description:
          "**Click on the buttons to match emojis with their pairs.**",
      },
      timeoutTime: 60000,
      emojis: [
        "🍉",
        "🍇",
        "🍊",
        "🥭",
        "🍎",
        "🍏",
        "🥝",
        "🥥",
        "🍓",
        "🫐",
        "🍍",
        "🥕",
        "🥔",
      ],
      winMessage:
        "**You won the Game! You turned a total of `{tilesTurned}` tiles.**",
      loseMessage:
        "**You lost the Game! You turned a total of `{tilesTurned}` tiles.**",
      playerOnlyMessage: "Only {player} can use these buttons.",
    });

    Game.startGame();
  },
};
