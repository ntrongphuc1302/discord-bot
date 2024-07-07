const { SlashCommandBuilder } = require("discord.js");
const { GuessThePokemon } = require("discord-gamecord");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("guessthepokemon")
    .setDescription("Play Guess The Pokemon game"),

  async execute(interaction) {
    const { guild, client } = interaction;

    const botMember = await guild.members.fetch(client.user.id);
    const botColor = botMember.roles.highest.hexColor || "#5865F2";

    const Game = new GuessThePokemon({
      message: interaction,
      isSlashGame: true,
      embed: {
        title: `Who's The Pokemon?`,
        color: botColor,
      },
      timeoutTime: 60000,
      winMessage: "You guessed it right! It was a {pokemon}.",
      loseMessage: "Better luck next time! It was a {pokemon}.",
      errMessage: "Unable to fetch pokemon data! Please try again.",
      playerOnlyMessage: "Only {player} can use these buttons.",
    });

    Game.startGame();
  },
};
