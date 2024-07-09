const {
  SlashCommandBuilder,
  EmbedBuilder,
  ChannelType,
} = require("discord.js");
const voiceschema = require("../../Schemas/jointocreate.schema.js");

module.exports = {
  admin: true,
  data: new SlashCommandBuilder()
    .setName("jointocreate")
    .setDescription("Setup or disable join to create voice channel")
    .addStringOption((option) =>
      option
        .setName("action")
        .setDescription("Setup or disable join to create voice channel")
        .setRequired(true)
        .addChoices(
          { name: "setup", value: "setup" },
          { name: "disable", value: "disable" }
        )
    )
    .addChannelOption((option) =>
      option
        .setName("channel")
        .setDescription("The channel to create or disable the voice channel in")
        .setRequired(true)
        .addChannelTypes(ChannelType.GuildVoice)
    ),

  async execute(interaction) {
    const action = interaction.options.getString("action");
    const channel = interaction.options.getChannel("channel");
    const data = await voiceschema.findOne({ Guild: interaction.guild.id });

    if (action === "setup") {
      if (data) {
        return interaction.reply(
          "Join to create voice channel is already setup."
        );
      }

      if (!channel) {
        return interaction.reply(
          "Please specify the channel to setup join to create."
        );
      }

      await voiceschema.create({
        Guild: interaction.guild.id,
        Channel: channel.id,
      });

      const botMember = await interaction.guild.members.fetch(
        interaction.client.user.id
      );
      const botColor = botMember.roles.highest.color;

      const embed = new EmbedBuilder()
        .setColor(botColor)
        .setDescription(
          `Successfully setup join to create voice channel in ${channel.name}`
        );

      return interaction.reply({ embeds: [embed] });
    } else if (action === "disable") {
      if (!data) {
        return interaction.reply("Join to create voice channel is not setup.");
      }

      await voiceschema.findOneAndDelete({ Guild: interaction.guild.id });

      const botMember = await interaction.guild.members.fetch(
        interaction.client.user.id
      );
      const botColor = botMember.roles.highest.color;

      const embed = new EmbedBuilder()
        .setColor(botColor)
        .setDescription(`Successfully disabled join to create voice channel.`);

      return interaction.reply({ embeds: [embed] });
    } else {
      return interaction.reply(
        "Please provide a valid action (`setup` or `disable`) for join to create voice channel."
      );
    }
  },
};
