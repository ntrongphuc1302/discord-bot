const {
  EmbedBuilder,
  Events,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
} = require("discord.js");
const { bug_report_channel_id } = require("../config");

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

      const channel = server.channels.cache.get(bug_report_channel_id);

      const botMember = await interaction.guild.members.fetch(
        interaction.client.user.id
      );
      const botColor = botMember.roles.highest.color;

      const embed = new EmbedBuilder()
        .setColor(botColor)
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
