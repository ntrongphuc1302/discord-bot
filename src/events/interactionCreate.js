// const { Interaction } = require("discord.js");
const modrole = require("../Schemas/modrole");
const { admin_id } = require("../config");

module.exports = {
  name: "interactionCreate",
  async execute(interaction, client) {
    // Bug Solved Button
    if (interaction.customId) {
      if (interaction.customId.includes("bugSolved - ")) {
        var stringId = interaction.customId;
        stringId = stringId.replace("bugSolved - ", "");

        var member = await client.users.fetch(stringId);
        await member
          .send(
            "This message was initialized by the developers indicating that the bug you reported has been resolved."
          )
          .catch((err) => {});
        await interaction.reply({
          content: "I have notified the user that the bug has been resolved.",
          ephemeral: true,
        });
        await interaction.message.delete().catch((err) => {});
      }
    }

    if (!interaction.isCommand()) return;

    const command = client.commands.get(interaction.commandName);

    if (!command) return;

    // Admin
    if (command.admin) {
      if (interaction.user.id !== admin_id) {
        return await interaction.reply({
          content: `Only **Admin** can use this command.`,
          ephemeral: true,
        });
      }
    }

    // Mod Role
    if (command.mod) {
      var modRoleData = await modrole.find({ Guild: interaction.guild.id });
      if (modRoleData.length > 0) {
        var check;
        await modRoleData.forEach(async (value) => {
          const mRoles = await interaction.member.roles.cache.map(
            (role) => role.id
          );
          await mRoles.forEach(async (role) => {
            if (role == value.Role) check = true;
          });
        });

        if (!check)
          return await interaction.reply({
            content: `Only **moderators** can use this command!`,
            ephemeral: true,
          });
      }
    }

    try {
      await command.execute(interaction, client);
    } catch (error) {
      console.log(error);
      await interaction.reply({
        content: "There was an error while executing this command!",
        ephemeral: true,
      });
    }
  },
};
