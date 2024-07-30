const { SlashCommandBuilder } = require("@discordjs/builders");
const { EmbedBuilder } = require("discord.js");
const Data = require("../../Schemas/data");

module.exports = {
  admin: true,
  data: new SlashCommandBuilder()
    .setName("deletedata")
    .setDescription("Delete data by ID")
    .addIntegerOption((option) =>
      option
        .setName("id")
        .setDescription("The ID of the data to delete")
        .setRequired(true)
    ),
  async execute(interaction, client) {
    const id = interaction.options.getInteger("id");

    try {
      // Find and delete the data entry by ID
      const deletedData = await Data.findOneAndDelete({ id: id });

      if (!deletedData) {
        await interaction.reply({
          content: `Data with ID ${id} was not found.`,
          ephemeral: true,
        });
        return;
      }

      // Get the bot's color from the guild's highest role
      const botMember = await interaction.guild.members.fetch(
        interaction.client.user.id
      );
      const botColor = botMember.roles.highest.color || "#1e1f22"; // Default to black if no color is set

      // Create an embed for the deleted data
      const embed = new EmbedBuilder()
        .setTitle("Data Deleted Successfully")
        .setColor(botColor)
        .addFields(
          { name: "ID", value: deletedData.id.toString(), inline: true },
          { name: "Name", value: deletedData.name || "N/A", inline: true },
          { name: "Phone", value: deletedData.phone || "N/A", inline: true },
          {
            name: "Birthday",
            value: deletedData.birthday
              ? `${String(deletedData.birthday.getDate()).padStart(
                  2,
                  "0"
                )}-${String(deletedData.birthday.getMonth() + 1).padStart(
                  2,
                  "0"
                )}-${deletedData.birthday.getFullYear()}`
              : "N/A",
            inline: true,
          }
        )
        .setTimestamp();

      await interaction.reply({
        embeds: [embed],
        ephemeral: true,
      });
    } catch (error) {
      console.error(error);
      await interaction.reply({
        content: "An error occurred while trying to delete the data.",
        ephemeral: true,
      });
    }
  },
};
