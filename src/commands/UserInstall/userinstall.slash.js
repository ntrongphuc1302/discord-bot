module.exports = {
  data: {
    name: "userinstall",
    description: "User install command",
    integration_types: [1],
    contexts: [0, 1, 2],
  },
  async execute(interaction) {
    const ownerId = process.env.discord_bot_owner_id;

    // Check if the user invoking the command is the owner
    if (interaction.user.id !== ownerId) {
      await interaction.reply({
        content: "You are not authorized to use this command.",
        ephemeral: true,
      });
      return;
    }

    // Only execute the command for the owner
    await interaction.reply({ content: "Working!", ephemeral: true });
  },
};
