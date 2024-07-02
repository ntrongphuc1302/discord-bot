module.exports = {
  data: {
    name: "userinstall",
    description: "User install command",
    integration_types: [1],
    contexts: [0, 1, 2],
  },
  async execute(interaction) {
    await interaction.reply({ content: "Working!", ephemeral: true });
  },
};
