const {
  EmbedBuilder,
  Events,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
} = require("discord.js");

module.exports = {
  name: Events.InteractionCreate,
  async execute(interaction, client) {
    if (!interaction.guild || !interaction.isModalSubmit()) return;

    if (interaction.customId === "bugreport") {
      const command = interaction.fields.getTextInputValue("type");
      const description = interaction.fields.getTextInputValue("description");

      const id = interaction.user.id;
      const member = interaction.member;
      const server = interaction.guild;

      const channel = server.channels.cache.get("1257953446183829595");

      const embed = new EmbedBuilder()
        .setColor("591bfe")
        .setTitle("New Bug Report")
        .addFields({
          name: "Reporter",
          value: `\`${member.user.username} (${id})\``,
        })
        .addFields({
          name: "Reporting Guild",
          value: `\`${server.name} (${server.id})\``,
        })
        .addFields({ name: `Problematic Feature`, value: `\`${command}\`` })
        .addFields({ name: `Description`, value: `\`${description}\`` })
        .setTimestamp()
        .setFooter({ text: "Bug Report System" });

      const button = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
          .setCustomId(`bugSolved - ${id}`)
          .setStyle(ButtonStyle.Danger)
          .setLabel("Mark as Resolved")
      );

      await channel
        .send({ embeds: [embed], components: [button] })
        .catch((err) => {});
      await interaction.reply({
        content:
          "Your bug report has been submitted. Thank you for your feedback!",
        ephemeral: true,
      });
    }
  },
};
