const { EmbedBuilder } = require("discord.js");
const { exec } = require("child_process");
const { embedErrorColor, embedDark } = require("../../config");

module.exports = {
  admin: true,
  data: {
    name: "restart",
    description: "Restart the bot's process using PM2",
  },

  async execute(interaction) {
    try {
      await interaction.deferReply();

      const command = "npm i pm2 -g && pm2 restart 0";

      exec(command, (error, stdout, stderr) => {
        if (error) {
          console.error(`Error executing command: ${error}`);
          const errEmbed = new EmbedBuilder()
            .setTitle("An error occurred")
            .setDescription("```" + error.message + "```")
            .setColor(embedErrorColor);

          interaction.editReply({ embeds: [errEmbed], ephemeral: true });
        } else {
          const output = stdout || stderr || "No output";

          const resultEmbed = new EmbedBuilder()
            .setTitle("Command Execution")
            .addFields({ name: "Command", value: `\`\`\`${command}\`\`\`` })
            .addFields({ name: "Output", value: `\`\`\`${output}\`\`\`` })
            .setColor(embedDark)
            .setFooter({
              text: `Executed by ${interaction.user.displayName}`,
              iconURL: interaction.user.displayAvatarURL({ dynamic: true }),
            })
            .setTimestamp();

          interaction.editReply({ embeds: [resultEmbed] });
        }
      });
    } catch (error) {
      console.error(`Error executing command: ${error}`);
      const errEmbed = new EmbedBuilder()
        .setTitle("An error occurred")
        .setDescription("```" + error.message + "```")
        .setColor(embedErrorColor);

      await interaction.editReply({ embeds: [errEmbed], ephemeral: true });
    }
  },
};
