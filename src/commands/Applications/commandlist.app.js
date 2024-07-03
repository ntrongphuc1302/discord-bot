const {
  ContextMenuCommandBuilder,
  ApplicationCommandType,
  EmbedBuilder,
} = require("discord.js");
const fs = require("fs");
const path = require("path");

module.exports = {
  data: new ContextMenuCommandBuilder()
    .setName("View Command List")
    .setType(ApplicationCommandType.User),

  async execute(interaction) {
    try {
      await interaction.deferReply({ ephemeral: true });

      // Get all files in the Community folder
      const communityFolderPath = path.join(__dirname, "..", "Community");
      const commandFiles = fs.readdirSync(communityFolderPath);

      // Filter command files to include only .js files
      const jsFiles = commandFiles.filter((file) => file.endsWith(".js"));

      // Map valid command names to embed fields
      const commands = jsFiles.map((file) => {
        const commandName = file.replace(".slash.js", ""); // Adjust extension if needed
        return {
          name: `/${commandName}`, // Ensure name is a string
          value: "Description here", // Provide default description or dynamically retrieve it
        };
      });

      // Create the embed with the list of commands
      const embed = new EmbedBuilder()
        .setTitle(`Slash Commands [${commands.length}]`)
        .setDescription("Here is a list of all available slash commands.")
        .addFields(commands);

      // Send the embed as a reply to the interaction
      await interaction.editReply({ embeds: [embed.toJSON()] });
    } catch (error) {
      console.error("Error executing context menu command:", error);
      // Handle errors appropriately
      await interaction.reply({
        content: "There was an error while executing this command!",
        ephemeral: true,
      });
    }
  },
};
