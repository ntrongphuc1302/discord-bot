const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const fs = require("fs");
const path = require("path");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("commandlist")
    .setDescription("Display all slash commands"),

  async execute(interaction, client) {
    try {
      await interaction.deferReply();

      // Get all files in the Community folder
      const communityFolderPath = path.join(__dirname, "..", "Community");
      const commandFiles = fs
        .readdirSync(communityFolderPath)
        .filter((file) => file.endsWith(".js"));

      // Filter valid command objects
      const commands = commandFiles
        .map((file) => {
          const commandPath = path.join(communityFolderPath, file);
          const command = require(commandPath);

          if (command && command.data && command.data.name) {
            return {
              name: `/${command.data.name}`,
              value: command.data.description || "No description provided",
            };
          }
          return null;
        })
        .filter((cmd) => cmd !== null);

      const botMember = await interaction.guild.members.fetch(
        interaction.client.user.id
      );
      const botColor = botMember.roles.highest.color || embedBotColor;

      // Create the embed with the list of commands
      const embed = new EmbedBuilder()
        .setTitle(`Slash Commands [${commands.length}]`)
        .setDescription("Here is a list of all available slash commands.")
        .addFields(commands)
        .setColor(botColor)
        .setFooter({
          text: `Requested by ${interaction.user.displayName}`,
          iconURL: interaction.user.displayAvatarURL({ dynamic: true }),
        })
        .setTimestamp();

      // Send the embed as a reply to the interaction
      await interaction.editReply({ embeds: [embed] });
    } catch (error) {
      console.error("Error fetching or sending slash command help:", error);
      await interaction.editReply({
        content: "There was an error while fetching slash commands.",
        ephemeral: true,
      });
    }
  },
};
