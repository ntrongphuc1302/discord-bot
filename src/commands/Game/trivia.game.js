const { SlashCommandBuilder } = require("discord.js");
const { Trivia } = require("discord-gamecord");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("trivia")
    .setDescription("Play Trivia")
    .addStringOption((option) =>
      option
        .setName("difficulty")
        .setDescription("Choose difficulty")
        .setRequired(true)
        .addChoices([
          { name: "Easy", value: "easy" },
          { name: "Medium", value: "medium" },
          { name: "Hard", value: "hard" },
        ])
    ),

  async execute(interaction) {
    const { guild, client, user } = interaction;
    const difficulty = interaction.options.getString("difficulty");

    // Fetch the bot member to get its highest role color
    const botMember = await guild.members.fetch(client.user.id);
    const botColor = botMember.roles.highest.hexColor || "#5865F2";

    // Create a new instance of the Trivia game
    const Game = new Trivia({
      message: interaction,
      isSlashGame: true,
      embed: {
        title: "Trivia",
        color: botColor,
        description: "You have 60 seconds to guess the answer.",
      },
      timeoutTime: 60000,
      buttonStyle: "PRIMARY",
      trueButtonStyle: "SUCCESS",
      falseButtonStyle: "DANGER",
      mode: "multiple", // multiple || single
      difficulty: difficulty, // easy || medium || hard
      winMessage: "You won! The correct answer is {answer}.",
      loseMessage: "You lost! The correct answer is {answer}.",
      errMessage: "Unable to fetch question data! Please try again.",
      playerOnlyMessage: "Only {player} can use these buttons.",
    });

    // Function to update the timer every 5 seconds
    const updateTimer = () => {
      const remainingTime = Game.time / 1000; // Convert to seconds
      interaction.editReply(
        `Time remaining: ${Math.ceil(remainingTime)} seconds`
      );
    };

    // Start the game
    Game.startGame();

    // Update the timer every 5 seconds
    const timerInterval = setInterval(() => {
      if (Game.ended) {
        clearInterval(timerInterval); // Stop updating timer if game has ended
        return;
      }
      updateTimer();
    }, 5000); // Update timer every 5 seconds
  },
};
