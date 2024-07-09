const { ApplicationCommandOptionType, EmbedBuilder } = require("discord.js");
const { exec } = require("child_process");
const { embedErrorColor, embedDark } = require("../../config");

module.exports = {
  admin: true,
  data: {
    name: "git",
    description: "Execute Git commands",
    options: [
      {
        name: "command",
        description: "Select the Git command to execute",
        type: ApplicationCommandOptionType.String,
        required: true,
        choices: [
          {
            name: "add",
            value: "add",
          },
          {
            name: "commit",
            value: "commit",
          },
          {
            name: "push",
            value: "push",
          },
          {
            name: "reset",
            value: "reset",
          },
          {
            name: "pull",
            value: "pull",
          },
        ],
      },
      {
        name: "message",
        description: "Commit message (required for commit subcommand)",
        type: ApplicationCommandOptionType.String,
        required: false,
      },
    ],
  },

  async execute(interaction) {
    try {
      await interaction.deferReply();

      const command = interaction.options.getString("command");
      let gitCommand;

      switch (command) {
        case "add":
          gitCommand = "git add .";
          break;
        case "commit":
          let commitMessage = interaction.options.getString("message");
          if (!commitMessage) {
            commitMessage = "update"; // Default commit message
          }
          gitCommand = `git commit -m "${commitMessage}"`;
          break;
        case "push":
          gitCommand = "git push -u origin main";
          break;
        case "reset":
          gitCommand = "git reset --hard";
          break;
        case "pull":
          gitCommand = "git pull origin main";
          break;
        default:
          return await interaction.editReply({
            content: "Invalid command option.",
            ephemeral: true,
          });
      }

      exec(gitCommand, (error, stdout, stderr) => {
        if (error) {
          console.error(`Error executing command: ${error}`);
          const errEmbed = new EmbedBuilder()
            .setTitle("An error occurred")
            .setDescription("```" + error.message + "```")
            .setColor(embedErrorColor);

          return interaction.editReply({ embeds: [errEmbed], ephemeral: true });
        }

        const output = stdout || stderr || "No output";

        const resultEmbed = new EmbedBuilder()
          .setTitle("Git Command Execution")
          .addFields({ name: "Command", value: `\`\`\`${gitCommand}\`\`\`` })
          .addFields({ name: "Output", value: `\`\`\`${output}\`\`\`` })
          .setColor(embedDark);
        // .setFooter({
        //   text: `Executed by ${interaction.user.displayName}`,
        //   iconURL: interaction.user.displayAvatarURL({ dynamic: true }),
        // })
        // .setTimestamp();

        interaction.editReply({ embeds: [resultEmbed] });
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
