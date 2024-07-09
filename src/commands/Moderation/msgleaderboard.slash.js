const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const lb = require("../../Schemas/msgleaderboard");

module.exports = {
  mod: true,
  data: new SlashCommandBuilder()
    .setName("msgleaderboard")
    .setDescription("Shows the leaderboard of messages sent in the server")
    .addUserOption((option) =>
      option
        .setName("user")
        .setDescription("The user to get the message count of")
        .setRequired(false)
    ),
  async execute(interaction) {
    const { options } = interaction;
    const user = options.getUser("user");

    async function total() {
      const data = await lb.find({ Guild: interaction.guild.id });
      return data.map((d) => ({
        user: d.User,
        messages: d.Messages,
      }));
    }

    async function lbUser(user) {
      const data = await lb.find({ Guild: interaction.guild.id });
      if (!data) return "No data found";

      if (user) {
        const standings = await total();
        standings.sort((a, b) => b.messages - a.messages);
        return standings.findIndex((item) => item.user === user) + 1;
      }
    }

    function formatNumber(num) {
      if (num >= 1e9) {
        return (num / 1e9).toFixed(1) + "B";
      } else if (num >= 1e6) {
        return (num / 1e6).toFixed(1) + "M";
      } else if (num >= 1e3) {
        return (num / 1e3).toFixed(1) + "K";
      }
      return num.toString();
    }

    if (user) {
      const data = await lb.findOne({
        Guild: interaction.guild.id,
        User: user.id,
      });

      if (!data)
        return await interaction.reply({
          content: "This user has not sent any messages in this server.",
          ephemeral: true,
        });

      const botMember = await interaction.guild.members.fetch(
        interaction.client.user.id
      );
      const botColor = botMember.roles.highest.color;

      const embed = new EmbedBuilder()
        .setColor(botColor)
        .setTitle(`${user.displayName}'s Message Standings`)
        .addFields(
          {
            name: "Leaderboard Standing",
            value: `\`${await lbUser(user.id)}\``,
          },
          {
            name: "Total Messages",
            value: `\`${formatNumber(data.Messages)}\``,
          }
        )
        .setFooter({
          text: `Requested by ${interaction.user.displayName}`,
          iconURL: interaction.user.displayAvatarURL({ dynamic: true }),
        })
        .setTimestamp();
      await interaction.reply({ embeds: [embed] });
    } else {
      const data2 = await lb.find({ Guild: interaction.guild.id });
      if (!data2 || data2.length === 0)
        return await interaction.reply({
          content: "No data found",
          ephemeral: true,
        });

      const leaderboard = await total();
      leaderboard.sort((a, b) => b.messages - a.messages);

      // Filter out duplicate users
      const uniqueLeaderboard = [];
      const userSet = new Set();
      for (const item of leaderboard) {
        if (!userSet.has(item.user)) {
          userSet.add(item.user);
          uniqueLeaderboard.push(item);
        }
      }

      const output = uniqueLeaderboard.slice(0, 10);

      let string = "";
      let num = 1;
      for (const value of output) {
        const member = await interaction.guild.members.fetch(value.user);
        string += `${num}. **${member.user.displayName}** - \`${formatNumber(
          value.messages
        )}\`\n`;
        num++;
      }

      const botMember = await interaction.guild.members.fetch(
        interaction.client.user.id
      );
      const botColor = botMember.roles.highest.color;

      const embed = new EmbedBuilder()
        .setColor(botColor)
        .setTitle(
          `**${interaction.guild.name}**'s Message Leaderboard (Top 10)`
        )
        .setDescription(string)
        .setFooter({
          text: `Requested by ${interaction.user.displayName}`,
          iconURL: interaction.user.displayAvatarURL({ dynamic: true }),
        })
        .setTimestamp();

      await interaction.reply({ embeds: [embed] });
    }
  },
};
