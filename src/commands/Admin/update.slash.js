const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const { exec } = require("child_process");
const { embedErrorColor, embedDark } = require("../../config");

module.exports = {
  admin: true,
  data: new SlashCommandBuilder()
    .setName("update")
    .setDescription("Update the bot's codebase and restart")
    .addStringOption((option) =>
      option
        .setName("option")
        .setDescription("Specify which bot to update")
        .setRequired(true)
        .addChoices([
          { name: "Bot", value: "bot" },
          { name: "PeterPi", value: "peterpi" },
        ])
    ),

  async execute(interaction) {
    try {
      await interaction.deferReply();

      const botToUpdate = interaction.options.getString("option");

      let commands = [];

      if (botToUpdate === "bot") {
        commands = [
          "git pull origin main",
          "npm i",
          "npm i pm2 -g",
          "pm2 restart 0",
        ];
      } else if (botToUpdate === "peterpi") {
        commands = ["sudo apt update", "sudo apt upgrade -y"];
      } else {
        const errEmbed = new EmbedBuilder()
          .setTitle("Invalid Bot Selection")
          .setDescription("Please select a valid bot to update.")
          .setColor(embedErrorColor);

        return interaction.editReply({ embeds: [errEmbed], ephemeral: true });
      }

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
                  .setColor(embedDark);

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
