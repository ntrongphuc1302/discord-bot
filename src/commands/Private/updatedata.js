const { SlashCommandBuilder } = require("@discordjs/builders");
const { EmbedBuilder } = require("discord.js");
const Data = require("../../Schemas/data");

module.exports = {
  admin: true,
  data: new SlashCommandBuilder()
    .setName("updatedata")
    .setDescription("Update existing data")
    .addIntegerOption((option) =>
      option
        .setName("id")
        .setDescription("The ID of the data to update")
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("name")
        .setDescription(
          "The new name associated with the data (or 'none', '.', or '/' to skip)"
        )
        .setRequired(false)
    )
    .addStringOption((option) =>
      option
        .setName("phone")
        .setDescription(
          "The new phone number associated with the data (or 'none', '.', or '/' to skip)"
        )
        .setRequired(false)
    )
    .addStringOption((option) =>
      option
        .setName("birthday")
        .setDescription(
          "The new birthday associated with the data (DD-MM or DD-MM-YYYY)"
        )
        .setRequired(false)
    ),
  async execute(interaction, client) {
    const id = interaction.options.getInteger("id");
    const newName = interaction.options.getString("name");
    const newPhone = interaction.options.getString("phone");
    const newBirthday = interaction.options.getString("birthday");

    let formattedBirthday;

    if (newBirthday) {
      const parts = newBirthday.split("-");
      const day = parseInt(parts[0], 10);
      const month = parseInt(parts[1], 10);
      const year = parts[2] ? parseInt(parts[2], 10) : new Date().getFullYear(); // Default to current year if no year is provided

      if (day && month && month >= 1 && month <= 12 && day >= 1 && day <= 31) {
        try {
          formattedBirthday = new Date(year, month - 1, day); // Months are 0-based in JS Date
        } catch (e) {
          console.error("Date parsing error:", e);
        }
      }
    }

    try {
      const existingData = await Data.findOne({ id: id });
      if (!existingData) {
        await interaction.reply({
          content: `No data found with ID ${id}.`,
          ephemeral: true,
        });
        return;
      }

      // Update fields only if new values are provided and are not "none", ".", or "/"
      if (newName && !["none", ".", "/", ""].includes(newName.toLowerCase())) {
        existingData.name = newName;
      }

      if (newPhone && !["none", ".", "/"].includes(newPhone.toLowerCase())) {
        existingData.phone = newPhone;
      } else if (newPhone === "none" || newPhone === "." || newPhone === "/") {
        // Skip updating phone if input is "none", ".", or "/"
        existingData.phone = existingData.phone || "0"; // Ensure default "0" if current phone is unset
      }

      if (formattedBirthday) existingData.birthday = formattedBirthday;

      // Save the updated data
      await existingData.save();

      // Get the bot's color from the guild's highest role
      const botMember = await interaction.guild.members.fetch(
        interaction.client.user.id
      );
      const botColor = botMember.roles.highest.color || "#1e1f22";

      // Format the birthday as DD-MM-YYYY for display
      const displayBirthday = existingData.birthday
        ? `${String(existingData.birthday.getDate()).padStart(2, "0")}-${String(
            existingData.birthday.getMonth() + 1
          ).padStart(2, "0")}-${existingData.birthday.getFullYear()}`
        : "N/A";

      // Create an embed for the updated data
      const embed = new EmbedBuilder()
        .setTitle("Data Updated Successfully")
        .setColor(botColor)
        .addFields(
          { name: "ID", value: id.toString(), inline: true },
          {
            name: "Name",
            value: existingData.name || "Not updated",
            inline: true,
          },
          { name: "Phone", value: existingData.phone, inline: true }, // Show phone number with leading zeros
          {
            name: "Birthday",
            value: displayBirthday || "Not updated",
            inline: true,
          }
        )
        .setTimestamp();

      await interaction.reply({
        embeds: [embed],
        ephemeral: true,
      });
    } catch (error) {
      console.error("Update data error:", error);
      await interaction.reply({
        content:
          "An error occurred while trying to update the data. Please check the console for details.",
        ephemeral: true,
      });
    }
  },
};
