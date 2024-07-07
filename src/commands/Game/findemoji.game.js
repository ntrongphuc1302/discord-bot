const { SlashCommandBuilder } = require("discord.js");
const { FindEmoji } = require("discord-gamecord");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("findemoji")
    .setDescription("Play a Find Emoji game"),

  async execute(interaction) {
    const { guild, client, member } = interaction;

    // Send a DM to the user who initiated the game
    try {
      await member.send("You have started a Find Emoji game!");
    } catch (error) {
      console.error(`Could not send DM to ${member.user.tag}:`, error);
      await interaction.reply({
        content: `Could not send DM to ${member.user.tag}. You might have DMs disabled.`,
        ephemeral: true,
      });
      return;
    }

    const botMember = await guild.members.fetch(client.user.id);
    const botColor = botMember.roles.highest.hexColor || "#5865F2";
    const displayName = member.displayName;

    const Game = new FindEmoji({
      message: interaction,
      isSlashGame: true,
      embed: {
        title: `${displayName}'s Find Emoji Game`,
        color: botColor,
        description: "Remember the emojis from the board below.",
        findDescription: "Find the {emoji} emoji before the time runs out.",
      },
      timeoutTime: 60000,
      hideEmojiTime: 5000,
      buttonStyle: "PRIMARY",
      emojis: ["🍉", "🍇", "🍊", "🍋", "🥭", "🍎", "🍏", "🥝"],
      winMessage: "You won! You selected the correct emoji. {emoji}",
      loseMessage: "You lost! You selected the wrong emoji. {emoji}",
      timeoutMessage: "You lost! You ran out of time. The emoji is {emoji}",
      playerOnlyMessage: "Only {player} can use these buttons.",
    });

    Game.startGame();
  },
};
