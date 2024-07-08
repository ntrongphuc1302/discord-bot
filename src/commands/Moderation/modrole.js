const {
  SlashCommandBuilder,
  EmbedBuilder,
  PermissionsBitField,
} = require("discord.js");
const modrole = require("../../Schemas/modrole");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("modrole")
    .setDescription("Mod Role")
    .addSubcommand((command) =>
      command
        .setName("add")
        .setDescription("Add a mod role to the database")
        .addRoleOption((option) =>
          option
            .setName("role")
            .setDescription("The role to add")
            .setRequired(true)
        )
    )
    .addSubcommand((command) =>
      command
        .setName("remove")
        .setDescription("Remove a mod role from the database")
        .addRoleOption((option) =>
          option
            .setName("role")
            .setDescription("The role to remove")
            .setRequired(true)
        )
    )
    .addSubcommand((command) =>
      command.setName("check").setDescription("Check the mod role(s)")
    ),

  async execute(interaction) {
    await interaction.deferReply({ ephemeral: true });

    const { options } = interaction;
    const sub = options.getSubcommand();
    var data = await modrole.find({ Guild: interaction.guild.id });

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
      var role = options.getRole("role");
      return data.some((value) => value.Role == role.id);
    }

    if (
      !interaction.member.permissions.has(
        PermissionsBitField.Flags.Administrator
      )
    )
      return await sendMessage(
        "You do not have permission to use this command."
      );

    switch (sub) {
      case "add":
        var check = await checkData();
        var role = options.getRole("role");

        if (check) {
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
        var check = await checkData();
        var role = options.getRole("role");

        if (!check) {
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
        var values = data.map(async (value) => {
          if (!value.Role) return;
          var r = await interaction.guild.roles.cache.get(value.Role);
          return `**Role Name:** ${r.name} **Role ID:** ${r.id}`;
        });

        values = await Promise.all(values);

        values = values.filter(Boolean);

        if (values.length > 0) {
          await sendMessage(`**Mod Roles:**\n${values.join("\n")}`);
        } else {
          await sendMessage("There are no mod roles set.");
        }
    }
  },
};
