const { SlashCommandBuilder } = require("@discordjs/builders");
const { EmbedBuilder } = require("discord.js");
const Data = require("../../Schemas/data");

module.exports = {
  admin: true,
  data: new SlashCommandBuilder()
    .setName("adddata")
    .setDescription("Add new data")
    .addIntegerOption((option) =>
      option
        .setName("id")
        .setDescription("The ID for the data")
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("name")
        .setDescription("The name associated with the data")
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("phone")
        .setDescription("The phone number associated with the data")
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("birthday")
        .setDescription(
          "The birthday associated with the data (DD-MM or DD-MM-YYYY)"
        )
        .setRequired(false)
    ),
  async execute(interaction, client) {
    const id = interaction.options.getInteger("id");
    const name = interaction.options.getString("name");
    const phone = interaction.options.getString("phone");
    const birthday = interaction.options.getString("birthday");

    let formattedBirthday;

    if (birthday) {
      const parts = birthday.split("-");
      const day = parseInt(parts[0], 10);
      const month = parseInt(parts[1], 10);
      const year = parts[2] ? parseInt(parts[2], 10) : new Date().getFullYear(); // Default to current year if no year is provided

      if (day && month) {
        formattedBirthday = new Date(`${year}-${month}-${day}`);
      }
    }

    try {
      const existingData = await Data.findOne({ id: id });
      if (existingData) {
        await interaction.reply({
          content: `Data with ID ${id} already exists.`,
          ephemeral: true,
        });
        return;
      }

      const newData = new Data({
        id: id,
        name: name,
        phone: phone,
        birthday: formattedBirthday,
      });

      await newData.save();

      const botMember = await interaction.guild.members.fetch(
        interaction.client.user.id
      );
      const botColor = botMember.roles.highest.color || "#1e1f22";

      const displayBirthday = formattedBirthday
        ? `${String(formattedBirthday.getDate()).padStart(2, "0")}-${String(
            formattedBirthday.getMonth() + 1
          ).padStart(2, "0")}-${formattedBirthday.getFullYear()}`
        : "N/A";

      const embed = new EmbedBuilder()
        .setTitle("Data Added Successfully")
        .setColor(botColor)
        .addFields(
          { name: "ID", value: id.toString(), inline: true },
          { name: "Name", value: name, inline: true },
          { name: "Phone", value: phone, inline: true },
          { name: "Birthday", value: displayBirthday, inline: true }
        )
        .setTimestamp();

      await interaction.reply({
        embeds: [embed],
        ephemeral: true,
      });
    } catch (error) {
      console.error(error);
      await interaction.reply({
        content: "An error occurred while trying to add the data.",
        ephemeral: true,
      });
    }
  },
};
