const {
  SlashCommandBuilder,
  EmbedBuilder,
  ButtonBuilder,
  ButtonStyle,
  ActionRowBuilder,
} = require("discord.js");
const { embedBotColor } = require("../../config");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("mcserver-stats")
    .setDescription("Get information about a Minecraft server.")
    .addStringOption((option) =>
      option
        .setName("ip")
        .setDescription("The IP address of the Minecraft server.")
        .setRequired(true)
    ),

  async execute(interaction) {
    const { options } = interaction;
    const ip = options.getString("ip");

    var msg;
    async function sendMessage(message, button, updated) {
      const botMember = await interaction.guild.members.fetch(
        interaction.client.user.id
      );
      const botColor = botMember.roles.highest.color || embedBotColor;

      const embed = new EmbedBuilder()
        .setColor(botColor)
        .setDescription(message)
        .setFooter({
          text: `Requested by ${interaction.user.displayName}`,
          iconURL: interaction.user.displayAvatarURL({ dynamic: true }),
        })
        .setTimestamp();

      if (button) {
        const button = new ActionRowBuilder().addComponents(
          new ButtonBuilder()
            .setCustomId("mcserver-refresh")
            .setLabel("Refresh")
            .setStyle(ButtonStyle.Danger)
        );

        if (updated) {
          await interaction.editReply({
            embeds: [embed],
            components: [button],
          });
          await updated.reply({
            content: "Server status updated.",
            ephemeral: true,
          });
        } else {
          msg = await interaction.reply({
            embeds: [embed],
            components: [button],
          });
        }
      } else {
        await interaction.reply({ embeds: [embed] });
      }
    }
    // var getData = await fetch(`https://api.mcsrvstat.us/2/${ip}`)
    var getData = await fetch(`https://mcapi.us/server/status?ip=${ip}`);
    var response = await getData.json();

    if (response.status === "error") {
      await sendMessage(`${ip} is either offline or does not exist.`);
    }

    if (response.status === "success") {
      await sendMessage(
        ` **Minecraft Server Stats** \nIP: ${ip.toLowerCase()}\nOnline: ${
          response.online
        }\nPlayers: ${response.players.now}/${response.players.max}\nVersion: ${
          response.server.name
        }\n`,
        true
      );
      const collector = msg.createMessageComponentCollector();
      collector.on("collect", async (i) => {
        if (i.customId == "mcserver-refresh") {
          var updateData = await fetch(
            `https://mcapi.us/server/status?ip=${ip}`
          );
          var response = await updateData.json();
          await sendMessage(
            ` **Minecraft Server Stats** \nIP: ${ip.toLowerCase()}\nOnline: ${
              response.online
            }\nPlayers: ${response.players.now}/${
              response.players.max
            }\nVersion: ${response.server.name}\n`,
            true,
            i
          );
        }
      });
    }
  },
};
