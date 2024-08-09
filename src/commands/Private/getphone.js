const { SlashCommandBuilder } = require("@discordjs/builders");
const Data = require("../../Schemas/data");

module.exports = {
  admin: false,
  data: new SlashCommandBuilder()
    .setName("getphone")
    .setDescription("Retrieve phone number by ID or name")
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
          content: "No data found.",
          ephemeral: true,
        });
        return;
      }

      // Send only the phone number as the response
      await interaction.reply({
        content: data.phone || "N/A",
        ephemeral: true,
      });
    } catch (error) {
      console.error("Get phone number error:", error);
      await interaction.reply({
        content: "An error occurred while trying to retrieve the phone number.",
        ephemeral: true,
      });
    }
  },
};
