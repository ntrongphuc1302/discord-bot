const {
  SlashCommandBuilder,
  EmbedBuilder,
  PermissionsBitField,
} = require("discord.js");
const modrole = require("../../Schemas/modrole");

module.exports = {
  admin: true,
  data: new SlashCommandBuilder()
    .setName("modrole")
    .setDescription("Manage mod roles")
    .addStringOption((option) =>
      option
        .setName("action")
        .setDescription("The action to perform")
        .setRequired(true)
        .addChoices(
          { name: "Add", value: "add" },
          { name: "Remove", value: "remove" },
          { name: "Check", value: "check" }
        )
    )
    .addRoleOption((option) =>
      option
        .setName("role")
        .setDescription("The role to add or remove (required for add/remove)")
        .setRequired(false)
    ),

  async execute(interaction) {
    await interaction.deferReply({ ephemeral: true });

    const { options } = interaction;
    const action = options.getString("action");
    const role = options.getRole("role");
    const data = await modrole.find({ Guild: interaction.guild.id });

    async function sendMessage(message) {
      const botMember = await interaction.guild.members.fetch(
        interaction.client.user.id
      );
      const botColor = botMember.roles.highest.color;

      const embed = new EmbedBuilder()
        .setColor(botColor)
        .setDescription(message);

      await interaction.editReply({
        embeds: [embed],
      });
    }

    async function checkData() {
      return data.some((value) => value.Role === role.id);
    }

    if (
      !interaction.member.permissions.has(
        PermissionsBitField.Flags.Administrator
      )
    )
      return await sendMessage(
        "You do not have permission to use this command."
      );

    switch (action) {
      case "add":
        if (!role) return await sendMessage("You must provide a role to add.");
        if (await checkData()) {
          return await sendMessage("Looks like that is already a mod role.");
        } else {
          await modrole.create({
            Guild: interaction.guild.id,
            Role: role.id,
          });

          return await sendMessage(
            `The role ${role} has been added as a mod role.`
          );
        }
      case "remove":
        if (!role)
          return await sendMessage("You must provide a role to remove.");
        if (!(await checkData())) {
          return await sendMessage("Looks like that is not a mod role.");
        } else {
          await modrole.deleteOne({
            Guild: interaction.guild.id,
            Role: role.id,
          });
          return await sendMessage(
            `The role ${role} has been removed as a mod role.`
          );
        }
      case "check":
        const values = await Promise.all(
          data.map(async (value) => {
            if (!value.Role) return;
            const r = await interaction.guild.roles.cache.get(value.Role);
            return `**Role Name:** ${r.name} **Role ID:** ${r.id}`;
          })
        );

        const filteredValues = values.filter(Boolean);

        if (filteredValues.length > 0) {
          await sendMessage(`**Mod Roles:**\n${filteredValues.join("\n")}`);
        } else {
          await sendMessage("There are no mod roles set.");
        }
    }
  },
};
