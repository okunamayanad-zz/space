const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('kick')
		.setDescription('Kişiyi sunucudan atar.')
		.addUserOption(option => option.setName('hedef').setDescription('Atılacak kişiyi seçin.').setRequired(true))
		.addStringOption(option => option.setName('sebep').setDescription('Kişiyi atma sebebini buraya girin.').setRequired(false)),
	async execute(interaction) {
		const user = interaction.options.getUser('target');

		if (!interaction.message.member.hasPermission('KICK_MEMBERS')) return interaction.reply({ conent: 'Bu komutu kullanmak için yetkin yok.', empheral: true });
		if (!interaction.message.guild.me.hasPermission('KICK_MEMBERS')) return interaction.reply({ conent: 'Hata! Bu komutu kullanmak için botun "KICK" yetkisi olması gerekiyor.', empheral: true });
		
		if (!user) return interaction.reply({ conent: 'Hata! Bir kullanıcı belirtmedin.', empheral: true });
	},
};
