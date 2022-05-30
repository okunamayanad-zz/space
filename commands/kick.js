const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('kick')
		.setDescription('Select a member and kick them (but not really).')
		.addUserOption(option => option.setName('target').setDescription('The member to kick')),
	async execute(interaction) {
		const user = interaction.options.getUser('target');

		if (!interaction.message.member.hasPermission('KICK_MEMBERS')) return interaction.reply({ conent: 'Bu komutu kullanmak için yetkin yok.', empheral: true });
		if (!interaction.message.guild.me.hasPermission('KICK_MEMBERS')) return interaction.reply({ conent: 'Hata! Bu komutu kullanmak için botun "KICK" yetkisi olması gerekiyor.', empheral: true });
	},
};
