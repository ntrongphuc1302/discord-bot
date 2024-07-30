const { SlashCommandBuilder } = require("@discordjs/builders");
const { EmbedBuilder } = require("discord.js");
const Data = require("../../Schemas/data");

module.exports = {
  admin: true,
  data: new SlashCommandBuilder()
    .setName("listdata")
    .setDescription("Show all data"),
  async execute(interaction, client) {
    try {
      const allData = await Data.find();

      if (allData.length === 0) {
        await interaction.reply({
          content: "No data found.",
          ephemeral: true,
        });
        return;
      }

      // Split data into chunks if necessary to prevent exceeding message length limits
      const chunks = [];
      const chunkSize = 5; // Number of entries per embed

      for (let i = 0; i < allData.length; i += chunkSize) {
        const chunk = allData.slice(i, i + chunkSize);

        // Get the bot's color from the guild's highest role
        const botMember = await interaction.guild.members.fetch(
          interaction.client.user.id
        );
        const botColor = botMember.roles.highest.color || "#1e1f22"; // Default to black if no color is set

        const embed = new EmbedBuilder()
          .setTitle(`Data List (Page ${Math.floor(i / chunkSize) + 1})`)
          .setColor(botColor)
          .addFields(
            ...chunk.map((item) => ({
              name: `ID: ${item.id}`,
              value: `**Name:** ${item.name || "N/A"}\n**Phone:** ${
                item.phone || "N/A"
              }\n**Birthday:** ${
                item.birthday
                  ? `${String(item.birthday.getDate()).padStart(
                      2,
                      "0"
                    )}-${String(item.birthday.getMonth() + 1).padStart(
                      2,
                      "0"
                    )}-${item.birthday.getFullYear()}`
                  : "N/A"
              }`,
              inline: false,
            }))
          )
          .setTimestamp();

        chunks.push(embed);
      }

      for (const chunk of chunks) {
        await interaction.reply({
          embeds: [chunk],
          ephemeral: true,
        });
      }
    } catch (error) {
      console.error(error);
      await interaction.reply({
        content: "An error occurred while trying to retrieve the data.",
        ephemeral: true,
      });
    }
  },
};
