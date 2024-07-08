const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
  mod: true,
  data: new SlashCommandBuilder()
    .setName("eval")
    .setDescription("Evaluate javascript code")
    .addStringOption((option) =>
      option
        .setName("code")
        .setDescription("The code to evaluate")
        .setRequired(true)
    ),
  async execute(interaction) {
    const botMember = await interaction.guild.members.fetch(
      interaction.client.user.id
    );
    const botColor = botMember.roles.highest.color;

    async function sendMessage(message) {
      const embed = new EmbedBuilder()
        .setColor(botColor)
        .setDescription(message)
        .setFooter({
          text: `Requested by ${interaction.user.displayName}`,
          iconURL: interaction.user.displayAvatarURL({ dynamic: true }),
        })
        .setTimestamp();

      await interaction.reply({ embeds: [embed] }, { ephemeral: true });
    }

    const { options } = interaction;

    var code = options.getString("code");
    var output;

    try {
      output = await eval(code);
    } catch (error) {
      output = error.toString();
    }

    var replyString = `**Input:**\n\`\`\`js\n${code}\n\`\`\`\n**Output:**\n\`\`\`js\n${output}\n\`\`\``;

    if (interaction.replied) {
      const embed = new EmbedBuilder()
        .setColor(botColor)
        .setDescription(replyString);

      await interaction.editReply(
        { content: ``, embeds: [embed] },
        { ephemeral: true }
      );
    } else {
      await sendMessage(replyString);
    }
  },
};
