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
      // console.log("Community folder path:", communityFolderPath);
      const commandFiles = fs.readdirSync(communityFolderPath);
      // console.log("Command files:", commandFiles);

      // Filter command files to include only .js files
      const jsFiles = commandFiles.filter((file) => file.endsWith(".js"));
      // console.log("JavaScript command files:", jsFiles);

      // Map valid command names to embed fields
      const commands = jsFiles.map((file) => {
        const commandName = file.replace(".slash.js", ""); // Remove .slash.js extension
        const command = client.commands.get(commandName); // Get command object by name
        if (command) {
          return {
            name: `/${command.data.name}`, // Ensure name is a string
            value: command.data.description || "No description provided", // Provide default if description is missing
          };
        }
        return null; // Return null for commands not found (should not happen if file names match command names)
      });

      // console.log("Mapped commands:", commands);

      // Create the embed with the list of commands
      const embed = new EmbedBuilder()
        .setTitle(`Slash Commands [${commands.length}]`) // Adding count dynamically
        .setDescription("Here is a list of all available slash commands.")
        .addFields(commands);

      // Send the embed as a reply to the interaction
      await interaction.editReply({ embeds: [embed.toJSON()] }); // Convert embed to JSON before sending
    } catch (error) {
      console.error("Error fetching or sending slash command help:", error);
      await interaction.editReply({
        content: "There was an error while fetching slash commands.",
        ephemeral: true,
      });
    }
  },
};

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
//         .addFields(commands);

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
