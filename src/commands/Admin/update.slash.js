const {
  Client,
  ApplicationCommandOptionType,
  EmbedBuilder,
} = require("discord.js");
const { exec } = require("child_process");
const { embedErrorColor, admin_id, embedDark } = require("../../config");

module.exports = {
  data: {
    name: "update",
    description: "Update the bot's codebase and restart",
  },

  async execute(interaction) {
    // Permission check (replace with your bot owner's ID)
    if (interaction.user.id !== admin_id) {
      return await interaction.reply({
        content: "You do not have permission to use this command.",
        ephemeral: true,
      });
    }

    try {
      await interaction.deferReply();

      // Array of commands to execute sequentially
      const commands = [
        "git pull origin main",
        "npm i pm2 -g",
        "pm2 restart 0",
      ];

      // Function to execute each command in the array
      const executeCommands = async (commands) => {
        for (const command of commands) {
          await new Promise((resolve) => {
            exec(command, (error, stdout, stderr) => {
              if (error) {
                console.error(`Error executing command: ${error}`);
                const errEmbed = new EmbedBuilder()
                  .setTitle("An error occurred")
                  .setDescription("```" + error.message + "```")
                  .setColor(embedErrorColor);

                interaction.editReply({ embeds: [errEmbed], ephemeral: true });
                resolve();
              } else {
                const output = stdout || stderr || "No output";

                const resultEmbed = new EmbedBuilder()
                  .setTitle("Command Execution")
                  .addFields({
                    name: "Command",
                    value: `\`\`\`${command}\`\`\``,
                  })
                  .addFields({ name: "Output", value: `\`\`\`${output}\`\`\`` })
                  .setColor(embedDark)
                  .setFooter({
                    text: `Executed by ${interaction.user.displayName}`,
                    iconURL: interaction.user.displayAvatarURL({
                      dynamic: true,
                    }),
                  })
                  .setTimestamp();

                interaction.editReply({ embeds: [resultEmbed] });
                resolve();
              }
            });
          });
        }
      };

      // Execute commands sequentially
      await executeCommands(commands);
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
