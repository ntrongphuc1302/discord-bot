const {
  SlashCommandBuilder,
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
} = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("calculator")
    .setDescription("A simple calculator"),

  async execute(interaction) {
    const botMember = await interaction.guild.members.fetch(
      interaction.client.user.id
    );
    const botColor = botMember.roles.highest.color;

    const embed = new EmbedBuilder()
      .setColor(botColor)
      .setTitle("Ultimate Computational Engine")
      .setDescription(`\`\`\`0\`\`\``);

    const row1 = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId("cal-clear")
        .setLabel("Clear")
        .setStyle(ButtonStyle.Danger),
      new ButtonBuilder()
        .setCustomId("cal-(")
        .setLabel("(")
        .setStyle(ButtonStyle.Primary),
      new ButtonBuilder()
        .setCustomId("cal-)")
        .setLabel(")")
        .setStyle(ButtonStyle.Primary),
      new ButtonBuilder()
        .setCustomId("cal-divide")
        .setLabel("/")
        .setStyle(ButtonStyle.Primary)
    );
    const row2 = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId("cal-7")
        .setLabel("7")
        .setStyle(ButtonStyle.Secondary),
      new ButtonBuilder()
        .setCustomId("cal-8")
        .setLabel("8")
        .setStyle(ButtonStyle.Secondary),
      new ButtonBuilder()
        .setCustomId("cal-9")
        .setLabel("9")
        .setStyle(ButtonStyle.Secondary),
      new ButtonBuilder()
        .setCustomId("cal-multiply")
        .setLabel("x")
        .setStyle(ButtonStyle.Primary)
    );

    const row3 = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId("cal-4")
        .setLabel("4")
        .setStyle(ButtonStyle.Secondary),
      new ButtonBuilder()
        .setCustomId("cal-5")
        .setLabel("5")
        .setStyle(ButtonStyle.Secondary),
      new ButtonBuilder()
        .setCustomId("cal-6")
        .setLabel("6")
        .setStyle(ButtonStyle.Secondary),
      new ButtonBuilder()
        .setCustomId("cal-subtract")
        .setLabel("-")
        .setStyle(ButtonStyle.Primary)
    );

    const row4 = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId("cal-1")
        .setLabel("1")
        .setStyle(ButtonStyle.Secondary),
      new ButtonBuilder()
        .setCustomId("cal-2")
        .setLabel("2")
        .setStyle(ButtonStyle.Secondary),
      new ButtonBuilder()
        .setCustomId("cal-3")
        .setLabel("3")
        .setStyle(ButtonStyle.Secondary),
      new ButtonBuilder()
        .setCustomId("cal-add")
        .setLabel("+")
        .setStyle(ButtonStyle.Primary)
    );

    const row5 = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId("cal-dot")
        .setLabel(".")
        .setStyle(ButtonStyle.Primary),
      new ButtonBuilder()
        .setCustomId("cal-0")
        .setLabel("0")
        .setStyle(ButtonStyle.Secondary),
      new ButtonBuilder()
        .setCustomId("cal-00")
        .setLabel("00")
        .setStyle(ButtonStyle.Secondary),
      new ButtonBuilder()
        .setCustomId("cal-equal")
        .setLabel("=")
        .setStyle(ButtonStyle.Success)
    );

    await interaction.reply({
      embeds: [embed],
      components: [row1, row2, row3, row4, row5],
    });
  },
};
