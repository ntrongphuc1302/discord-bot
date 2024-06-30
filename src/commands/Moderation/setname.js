const { SlashCommandBuilder } = require("@discordjs/builders");

const ownerId = process.env.owner_id; // Replace with your Discord user ID

module.exports = {
  data: new SlashCommandBuilder()
    .setName("setname")
    .setDescription("Set the bot's name.")
    .addStringOption((option) =>
      option
        .setName("name")
        .setDescription("The new name for the bot")
        .setRequired(true)
    ),
  async execute(interaction, client) {
    // Check if the user is the bot owner
    if (interaction.user.id !== ownerId) {
      return interaction.reply({
        content: "You do not have permission to use this command.",
        ephemeral: true,
      });
    }

    // Get the new name from the command options
    const newName = interaction.options.getString("name");

    // Change the bot's name
    try {
      await client.user.setUsername(newName);
      await interaction.reply({
        content: `The bot's name has been changed to ${newName}.`,
        ephemeral: true,
      });
    } catch (error) {
      console.error("Error changing bot name:", error);
      await interaction.reply({
        content: "There was an error changing the bot's name.",
        ephemeral: true,
      });
    }
  },
};
