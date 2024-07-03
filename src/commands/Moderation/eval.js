const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
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
    async function sendMessage(message) {
      const embed = new EmbedBuilder()
        .setColor("#591bfe")
        .setDescription(message);

      await interaction.reply({ embeds: [embed] }, { ephemeral: true });
    }

    if (interaction.member.id !== "358614972223193089")
      return sendMessage("You do not have permission to use this command.");

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
        .setColor("#591bfe")
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
