const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const { embedBotColor, owner_id } = require("../../config");

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
    if (interaction.user.id !== owner_id) {
      return interaction.reply({
        content: "You do not have permission to use this command.",
        ephemeral: true,
      });
    }

    // Get the new name from the command options
    const newName = interaction.options.getString("name");

    const botMember = await interaction.guild.members.fetch(
      interaction.client.user.id
    );
    const botColor = botMember.roles.highest.color || embedBotColor;

    // Change the bot's name
    try {
      await client.user.setUsername(newName);
      const embed = new EmbedBuilder()
        .setTitle("Bot Name Changed")
        .addFields({ name: "New Name", value: `\`\`\`${newName}\`\`\`` })
        .setColor(botColor)
        .setFooter({
          text: `Changed by ${interaction.user.displayName}`,
          iconURL: interaction.user.displayAvatarURL({ dynamic: true }),
        })
        .setTimestamp();

      await interaction.reply({
        embeds: [embed],
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
