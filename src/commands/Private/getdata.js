const { SlashCommandBuilder } = require("@discordjs/builders");
const { EmbedBuilder } = require("discord.js");
const Data = require("../../Schemas/data");

module.exports = {
  admin: false,
  data: new SlashCommandBuilder()
    .setName("getdata")
    .setDescription("Retrieve data by ID or name")
    .addIntegerOption(
      (option) =>
        option
          .setName("id")
          .setDescription("The ID of the data to retrieve")
          .setRequired(false)
          .setAutocomplete(true) // Enable autocomplete for ID
    )
    .addStringOption(
      (option) =>
        option
          .setName("name")
          .setDescription("The name associated with the data")
          .setRequired(false)
          .setAutocomplete(true) // Enable autocomplete for name
    ),
  async execute(interaction, client) {
    const id = interaction.options.getInteger("id");
    const name = interaction.options.getString("name");

    try {
      let data;

      if (id) {
        data = await Data.findOne({ id });
      } else if (name) {
        data = await Data.findOne({ name });
      }

      if (!data) {
        await interaction.reply({
          content: `No data found with ${id ? `ID ${id}` : `name ${name}`}.`,
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
