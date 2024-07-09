const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const lb = require("../../Schemas/msgleaderboard");

module.exports = {
  mod: true,
  data: new SlashCommandBuilder()
    .setName("msgleaderboard")
    .setDescription("Shows the leaderboard of messages sent in the server")
    .addSubcommand((command) =>
      command
        .setName("user")
        .setDescription(
          "A specific user's message count + leaderboard standing"
        )
        .addUserOption((option) =>
          option
            .setName("user")
            .setDescription("The user to get the message count of")
            .setRequired(true)
        )
    )
    .addSubcommand((command) =>
      command
        .setName("total")
        .setDescription("Shows the total messages sent in the server")
    ),

  async execute(interaction) {
    const { options } = interaction;
    const sub = options.getSubcommand();

    switch (sub) {
      case "user":
        async function total() {
          var data = await lb.find({ Guild: interaction.guild.id });
          var standings = [];
          await data.forEach(async (d) => {
            standings.push({
              user: d.User,
              messages: d.Messages,
            });
          });

          return standings;
        }

        async function lbUser(user) {
          var data = await lb.find({ Guild: interaction.guild.id });
          if (!data) return "No data found";

          if (user) {
            var standings = await total();
            standings.sort((a, b) => b.messages - a.messages);
            return standings.findIndex((item) => item.user === user) + 1;
          }
        }

        const user = options.getUser("user");
        const data = await lb.findOne({
          Guild: interaction.guild.id,
          User: user.id,
        });
        if (!data)
          return await interaction.reply({
            content: "This user has not sent any messages in this server.",
            ephemeral: true,
          });
        else {
          var t = await total().then(async (data) => {
            return data.length;
          });

          const botMember = await interaction.guild.members.fetch(
            interaction.client.user.id
          );
          const botColor = botMember.roles.highest.color;

          const embed = new EmbedBuilder()
            .setColor(botColor)
            .setTitle(`${interaction.user.username}'s Message Standings`)
            .addFields({
              name: "Total Messages",
              value: `\`${data.Messages}\``,
            })
            .addFields({
              name: "Leaderboard Standing",
              value: `\`${await lbUser(user)}\` out of \`${t}\``,
            })
            .setFooter({
              text: `Requested by ${interaction.user.username}`,
              iconURL: interaction.user.displayAvatarURL({ dynamic: true }),
            })
            .setTimestamp();

          await interaction.reply({ embeds: [embed] });
        }

        break;
      case "total":
        var data2 = await lb.findOne({ Guild: interaction.guild.id });
        if (!data2)
          return await interaction.reply({
            content: "No data found",
            ephemeral: true,
          });
        else {
          var leaderboard = await total();
          leaderboard.sort((a, b) => b.messages - a.messages);
          var output = leaderboard.slice(0, 10);

          var string;
          var num = 1;
          await output.forEach(async (value) => {
            const member = await interaction.guild.members.fetch(value.user);
            string += `${num}. **${member.user.displayName}** - ${value.messages}\n`;
            num++;
          });

          string = string.replace("undefined", "");

          const botMember = await interaction.guild.members.fetch(
            interaction.client.user.id
          );
          const botColor = botMember.roles.highest.color;

          const embed = new EmbedBuilder()
            .setColor(botColor)
            .setTitle(
              `**${interaction.guild.name}**'s Message Leaderboard (Top 10)`
            )
            .setDescription(string);

          await interaction.reply({ embeds: [embed] });
        }
        break;
    }
  },
};
