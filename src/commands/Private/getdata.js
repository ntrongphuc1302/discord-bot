const { SlashCommandBuilder } = require("@discordjs/builders");
const { EmbedBuilder } = require("discord.js");
const Data = require("../../Schemas/data");

module.exports = {
  admin: false,
  data: new SlashCommandBuilder()
    .setName("getdata")
    .setDescription("Retrieve data by ID or name")
    .addStringOption((option) =>
      option
        .setName("input")
        .setDescription("The ID or name of the data to retrieve")
        .setRequired(true)
    ),
  async execute(interaction, client) {
    const input = interaction.options.getString("input");

    try {
      let data;

      if (!isNaN(input)) {
        // If the input is a number, treat it as an ID
        data = await Data.findOne({ id: parseInt(input, 10) });
      } else {
        // If the input is a string, treat it as a name and use regex for partial match
        const nameRegex = new RegExp(input, "i"); // Case-insensitive regex
        data = await Data.findOne({ name: nameRegex });
      }

      if (!data) {
        await interaction.reply({
          content: `No data found with ${
            !isNaN(input) ? `ID ${input}` : `name ${input}`
          }.`,
          ephemeral: true,
        });
        return;
      }

      // Get the bot's color from the guild's highest role
      const botMember = await interaction.guild.members.fetch(
        interaction.client.user.id
      );
      const botColor = botMember.roles.highest.color || "#1e1f22";

      // Format the birthday as DD-MM-YYYY for display
      const displayBirthday = data.birthday
        ? `${String(data.birthday.getDate()).padStart(2, "0")}-${String(
            data.birthday.getMonth() + 1
          ).padStart(2, "0")}-${data.birthday.getFullYear()}`
        : "N/A";

      // Create an embed for the retrieved data
      const embed = new EmbedBuilder()
        .setTitle("Data Retrieved")
        .setColor(botColor)
        .addFields(
          { name: "ID", value: data.id.toString(), inline: true },
          { name: "Name", value: data.name || "N/A", inline: true },
          { name: "Phone", value: data.phone || "N/A", inline: true },
          { name: "Birthday", value: displayBirthday || "N/A", inline: true }
        )
        .setTimestamp();

      await interaction.reply({
        embeds: [embed],
        ephemeral: true,
      });
    } catch (error) {
      console.error("Get data error:", error);
      await interaction.reply({
        content:
          "An error occurred while trying to retrieve the data. Please check the console for details.",
        ephemeral: true,
      });
    }
  },
};
