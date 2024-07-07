const { SlashCommandBuilder } = require("discord.js");
const { Hangman } = require("discord-gamecord");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("hangman")
    .setDescription("Play Hangman game")
    .addStringOption((option) =>
      option
        .setName("theme")
        .setDescription("Choose a theme for the Hangman game")
        .setRequired(true)
        .addChoices(
          { name: "nature", value: "nature" },
          { name: "sport", value: "sport" },
          { name: "color", value: "color" },
          { name: "camp", value: "camp" },
          { name: "fruit", value: "fruit" },
          { name: "discord", value: "discord" },
          { name: "winter", value: "winter" },
          { name: "pokemon", value: "pokemon" }
        )
    )
    .addStringOption((option) =>
      option
        .setName("customword")
        .setDescription("Provide a custom word for the Hangman game (optional)")
        .setRequired(false)
    ),

  async execute(interaction) {
    const { options, guild, client, member } = interaction;
    const theme = options.getString("theme");
    const customWord = options.getString("customword") || undefined;

    const botMember = await guild.members.fetch(client.user.id);
    const botColor = botMember.roles.highest.hexColor || "#5865F2";
    const displayName = member.displayName;

    const Game = new Hangman({
      message: interaction,
      isSlashGame: true,
      embed: {
        title: `${displayName}'s Hangman`,
        color: botColor,
      },
      hangman: {
        hat: "🎩",
        head: "😟",
        shirt: "👕",
        pants: "🩳",
        boots: "👞👞",
      },
      customWord: customWord,
      timeoutTime: 60000,
      theme: theme,
      winMessage: "You won! The word was **{word}**.",
      loseMessage: "You lost! The word was **{word}**.",
      playerOnlyMessage: "Only {player} can use these buttons.",
    });

    Game.startGame();
  },
};
