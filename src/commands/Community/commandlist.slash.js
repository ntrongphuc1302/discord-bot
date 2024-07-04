const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const fs = require("fs");
const path = require("path");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("commandlist")
    .setDescription("Display all slash commands"),

  async execute(interaction, client) {
    try {
      await interaction.deferReply();

      // Get all files in the Community folder
      const communityFolderPath = path.join(__dirname, "..", "Community");
      const commandFiles = fs
        .readdirSync(communityFolderPath)
        .filter((file) => file.endsWith(".js"));

      // Filter valid command objects
      const commands = commandFiles
        .map((file) => {
          const commandPath = path.join(communityFolderPath, file);
          const command = require(commandPath);

          if (command && command.data && command.data.name) {
            return {
              name: `/${command.data.name}`,
              value: command.data.description || "No description provided",
            };
          }
          return null;
        })
        .filter((cmd) => cmd !== null);

      // Create the embed with the list of commands
      const embed = new EmbedBuilder()
        .setTitle(`Slash Commands [${commands.length}]`)
        .setDescription("Here is a list of all available slash commands.")
        .addFields(commands)
        .setFooter({
          text: `Requested by ${interaction.user.displayName}`,
          iconURL: interaction.user.displayAvatarURL({ dynamic: true }),
        })
        .setTimestamp();

      // Send the embed as a reply to the interaction
      await interaction.editReply({ embeds: [embed] });
    } catch (error) {
      console.error("Error fetching or sending slash command help:", error);
      await interaction.editReply({
        content: "There was an error while fetching slash commands.",
        ephemeral: true,
      });
    }
  },
};

// All slash commands

// const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

// module.exports = {
//   data: new SlashCommandBuilder()
//     .setName("allcommand")
//     .setDescription("Display all slash commands"),

//   async execute(interaction, client) {
//     //Permission check
//     if (interaction.member.id !== process.env.discord_bot_owner_id) {
//       return await interaction.reply({
//         content: "You do not have permission to use this command.",
//         ephemeral: true,
//       });
//     }

//     try {
//       await interaction.deferReply({ ephemeral: true });

//       // Map all commands to embed fields
//       const commands = client.commands.map((command) => ({
//         name: `/${command.data.name}`, // Ensure name is a string
//         value: command.data.description || "No description provided", // Provide default if description is missing
//       }));

//       // Create the embed with the list of commands
//       const embed = new EmbedBuilder()
//         .setTitle(`Slash Commands [${commands.length}]`)
//         .setDescription("Here is a list of all available slash commands.")
//         .addFields(commands)
//         .setFooter({
//         text: `Requested by ${interaction.user.username}`,
//         iconURL: interaction.user.displayAvatarURL({ dynamic: true }),
//          })
//          .setTimestamp();

//       // Send the embed as a reply to the interaction
//       await interaction.editReply({ embeds: [embed.toJSON()] }); // Convert embed to JSON before sending
//     } catch (error) {
//       console.error("Error fetching or sending slash command help:", error);
//       await interaction.editReply({
//         content: "There was an error while fetching slash commands.",
//         ephemeral: true,
//       });
//     }
//   },
// };
