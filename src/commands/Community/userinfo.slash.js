const {
  SlashCommandBuilder,
  EmbedBuilder,
  PermissionsBitField,
} = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("userinfo")
    .setDescription("Get information about a user.")
    .addUserOption((option) =>
      option
        .setName("user")
        .setDescription("The user to get information about")
        .setRequired(false)
    ),

  async execute(interaction) {
    const user = interaction.options.getUser("user") || interaction.user;
    const member = await interaction.guild.members.fetch(user.id);

    const roles =
      member.roles.cache
        .filter((role) => role.id !== interaction.guild.id) // Remove @everyone role
        .map((role) => role.name)
        .join(", ") || "No roles";

    const highestRole = member.roles.highest;
    const highestRoleColor = highestRole.color || "#FFFFFF"; // Default to white if no color is set

    const isBoosting = member.premiumSince ? "Yes" : "No";
    const joinDate = member.joinedAt ? formatDate(member.joinedAt) : "Unknown";
    const creationDate = user.createdAt
      ? formatDate(user.createdAt)
      : "Unknown";

    const permissions = new PermissionsBitField(member.permissions.bitfield);
    let globalPermissions = "Standard User";

    // Check specific roles for special permissions
    if (member.roles.cache.has("1087611688020365352")) {
      globalPermissions = "Queen";
    } else if (member.roles.cache.has("1087456448872722534")) {
      globalPermissions = "Moderator";
    } else if (member.roles.cache.has("1087459750758854747")) {
      globalPermissions = "Bot";
    }

    // Check if the user is the server owner
    if (user.id === "358614972223193089") {
      globalPermissions = "👑 Server Owner";
    }

    const rolesCount = member.roles.cache.filter(
      (role) => role.id !== interaction.guild.id
    ).size;
    const rolesList =
      roles.length > 1024
        ? `${roles.slice(0, 1021)}...`
        : `\`\`\`${roles}\`\`\``;

    const embed = new EmbedBuilder()
      .setTitle(`${member.displayName}'s Information`)
      .setThumbnail(user.displayAvatarURL({ dynamic: true, size: 4096 }))
      .setColor(highestRoleColor)
      .addFields(
        {
          name: "Username",
          value: `\`\`\`${user.username}\`\`\``,
          inline: true,
        },
        {
          name: "User ID",
          value: `\`\`\`${user.id}\`\`\``,
        },
        {
          name: "Global permissions",
          value: `\`\`\`${globalPermissions}\`\`\``,
        },
        {
          name: `Roles [ ${rolesCount} ]`,
          value: rolesList,
        },
        {
          name: "Nickname",
          value: `\`\`\`${member.nickname || "No nickname"}\`\`\``,
          inline: true,
        },
        {
          name: "Is boosting",
          value: `\`\`\`${isBoosting}\`\`\``,
          inline: true,
        },
        {
          name: "Joined server on",
          value: `\`\`\`${joinDate}\`\`\``,
        },
        {
          name: "Account created on",
          value: `\`\`\`${creationDate}\`\`\``,
        }
      )
      .setFooter({
        text: `Requested by ${interaction.user.displayName}`,
        iconURL: interaction.user.displayAvatarURL({ dynamic: true }),
      })
      .setTimestamp();

    await interaction.reply({
      embeds: [embed],
      ephemeral: false,
    });
  },
};

function formatDate(date) {
  const now = new Date();
  const diff = now - date;

  const years = Math.floor(diff / (1000 * 60 * 60 * 24 * 365));
  const months = Math.floor(diff / (1000 * 60 * 60 * 24 * 30));
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor(diff / (1000 * 60));

  if (years > 0) {
    return `${date.toLocaleString("vi-VN", {
      month: "2-digit",
      day: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    })} (${years} ${years === 1 ? "year" : "years"} ago)`;
  } else if (months > 0) {
    return `${date.toLocaleString("vi-VN", {
      month: "2-digit",
      day: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    })} (${months} ${months === 1 ? "month" : "months"} ago)`;
  } else if (days > 0) {
    return `${date.toLocaleString("vi-VN", {
      month: "2-digit",
      day: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    })} (${days} ${days === 1 ? "day" : "days"} ago)`;
  } else if (hours > 0) {
    return `${date.toLocaleString("vi-VN", {
      month: "2-digit",
      day: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    })} (${hours} ${hours === 1 ? "hour" : "hours"} ago)`;
  } else if (minutes > 0) {
    return `${date.toLocaleString("vi-VN", {
      month: "2-digit",
      day: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    })} (${minutes} ${minutes === 1 ? "minute" : "minutes"} ago)`;
  } else {
    return `${date.toLocaleString("vi-VN", {
      month: "2-digit",
      day: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    })} (just now)`;
  }
}
