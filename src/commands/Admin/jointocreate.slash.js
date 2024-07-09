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
    .setDescription("Create a join to create channel")
    .addSubcommand((command) =>
      command
        .setName("setup")
        .setDescription("Setup a join to create voice channel")
        .addChannelOption((option) =>
          option
            .setName("channel")
            .setDescription("The channel to create the voice channel in")
            .setRequired(true)
            .addChannelTypes(ChannelType.GuildVoice)
        )
        .addChannelOption((option) =>
          option
            .setName("category")
            .setDescription("The category to create the voice channel in")
            .setRequired(true)
            .addChannelTypes(ChannelType.GuildCategory)
        )
        .addIntegerOption((option) =>
          option
            .setName("limit")
            .setDescription("The user limit for the voice channel")
            .setRequired(true)
        )
    )
    .addSubcommand((command) =>
      command
        .setName("disable")
        .setDescription("Disable join to create voice channel")
    ),

  async execute(interaction) {
    const data = await voiceschema.findOne({ Guild: interaction.guild.id });
    const sub = interaction.options.getSubcommand();

    switch (sub) {
      case "setup":
        if (data)
          return interaction.reply(
            "Join to create voice channel is already setup"
          );
        else {
          if (data)
            return interaction.reply(
              "Join to create voice channel is already setup"
            );
          const channel = interaction.options.getChannel("channel");
          const category = interaction.options.getChannel("category");
          const limit = interaction.options.getInteger("limit");

          await voiceschema.create({
            Guild: interaction.guild.id,
            Channel: channel.id,
            Category: category.id,
            VoiceLimit: limit,
          });

          const botMember = await interaction.guild.members.fetch(
            interaction.client.user.id
          );
          const botColor = botMember.roles.highest.color;

          const embed = new EmbedBuilder()
            .setColor(botColor)
            .setDescription(
              `Successfully setup join to create voice channel in ${category}`
            );

          await interaction.reply({ embeds: [embed] });
        }

        break;
      case "disable":
        if (!data)
          return interaction.reply("Join to create voice channel is not setup");
        else {
          await voiceschema.findOneAndDelete({ Guild: interaction.guild.id });

          const botMember = await interaction.guild.members.fetch(
            interaction.client.user.id
          );
          const botColor = botMember.roles.highest.color;

          const embed = new EmbedBuilder()
            .setColor(botColor)
            .setDescription(
              "Successfully disabled join to create voice channel"
            );

          await voiceschema.deleteMany({ Guild: interaction.guild.id });

          return interaction.reply({ embeds: [embed] });
        }
    }
  },
};
