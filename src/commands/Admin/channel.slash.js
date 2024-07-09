const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
  admin: true,
  data: new SlashCommandBuilder()
    .setName("channel")
    .setDescription("Locks or unlocks a channel")
    .addStringOption((option) =>
      option
        .setName("action")
        .setDescription("Lock or unlock the channel")
        .setRequired(true)
        .addChoices(
          { name: "lock", value: "lock" },
          { name: "unlock", value: "unlock" }
        )
    )
    .addChannelOption((option) =>
      option
        .setName("channel")
        .setDescription("The channel to lock or unlock")
        .setRequired(true)
    ),
  async execute(interaction) {
    const botMember = await interaction.guild.members.fetch(
      interaction.client.user.id
    );
    const botColor = botMember.roles.highest.color;

    const action = interaction.options.getString("action");
    let channel = interaction.options.getChannel("channel");

    if (action === "lock") {
      await channel.permissionOverwrites.create(interaction.guild.id, {
        SendMessages: false,
        ViewChannel: false,
      });
      const embed = new EmbedBuilder()
        .setColor(botColor)
        .setDescription(`Successfully locked ${channel}`);
      await interaction.reply({ embeds: [embed] });
    } else if (action === "unlock") {
      await channel.permissionOverwrites.create(interaction.guild.id, {
        SendMessages: null,
        ViewChannel: null,
      });
      const embed = new EmbedBuilder()
        .setColor(botColor)
        .setDescription(`Successfully unlocked ${channel}`);
      await interaction.reply({ embeds: [embed] });
    }
  },
};
