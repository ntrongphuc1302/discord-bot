const {
  SlashCommandBuilder,
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  ComponentType,
  PermissionsBitField,
} = require("discord.js");
const axios = require("axios");

module.exports = {
  admin: true,
  data: new SlashCommandBuilder()
    .setName("wip-admin-servertemplate")
    .setDescription("Get the template of the server.")
    .addStringOption((option) =>
      option
        .setName("name")
        .setDescription("The name of the template.")
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("description")
        .setDescription("The description of the template.")
        .setRequired(true)
    ),
  async execute(interaction) {
    const { options } = interaction;
    const name = options.getString("name");
    const description = options.getString("description");

    if (
      !interaction.member.permissions.has(
        PermissionsBitField.Flags.Administrator
      )
    )
      return await interaction.reply({
        content: "You do not have permission to use this command.",
        ephemeral: true,
      });

    const template = await axios
      .get(
        `https://discord.com/api/v10/guilds/${interaction.guild.id}/templates`,
        {
          name: name,
          description: description,
        },
        {
          headers: {
            Authorization: `Bot ${process.env.discord_bot_token}`,
            "Content-Type": "application/json",
          },
        }
      )
      .catch((err) => {});
    if (!template)
      return await interaction.reply({
        content: `There is already an existing template!`,
        ephemeral: true,
      });

    const button = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setStyle(ButtonStyle.Primary)
        .setLabel("Sync")
        .setCustomId("templateButton")
    );

    const botMember = await interaction.guild.members.fetch(
      interaction.client.user.id
    );
    const botColor = botMember.roles.highest.color || embedBotColor;

    const embed = new EmbedBuilder()
      .setColor(botColor)
      .setDescription(`Here is the template: ${template.data.code}`);

    const msg = await interaction.reply({
      embeds: [embed],
      components: [button],
    });

    const collector = msg.createMessageComponentCollector({
      ComponentType: ComponentType.Button,
    });
    collector.on("collect", async (i) => {
      if (i.customId === "templateButton") {
        const sync = await axios
          .put(
            `https://discord.com/api/v10/guilds/${interaction.guild.id}/templates/${template.data.code}`,
            {},
            {
              headers: {
                Authorization: `Bot ${process.env.discord_bot_token}`,
              },
            }
          )
          .catch((err) => {});

        embed.setDescription(
          `Your template has been synced! https://discord.new/${template.data.code}`
        );

        await msg.edit({ embeds: [embed], components: [button] });
        await i.reply({
          content: "Template has been synced!",
          ephemeral: true,
        });
      }
    });

    setTimeout(async () => {
      collector.on("end", async (collected) => {});
      await msg.edit({ embed: [embed], components: [] }).catch((err) => {});
    }, 300000);
  },
};
