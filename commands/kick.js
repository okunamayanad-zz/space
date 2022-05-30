const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('kick')
		.setDescription('Kişiyi sunucudan atar.')
		.addUserOption(option =>
			option
				.setName('hedef')
				.setDescription('Atılacak kişiyi seçin.')
				.setRequired(true))
		.addStringOption(option =>
			option
				.setName('sebep')
				.setDescription('Kişiyi atma sebebini buraya girin.')
				.setRequired(false)),
	async execute(interaction) {
		const user = interaction.options.getUser('target');

		if (!interaction.message.member.hasPermission('KICK_MEMBERS')) return interaction.reply({ content: 'Bu komutu kullanmak için yetkin yok.', empheral: true });
		if (!interaction.message.guild.me.hasPermission('KICK_MEMBERS')) return interaction.reply({ content: 'Hata! Bu komutu kullanmak için botun "KICK" yetkisi olması gerekiyor.', empheral: true });

		if (!user) return interaction.reply({ conent: 'Hata! Bir kullanıcı belirtmedin.', empheral: true });

		if (user.id === interaction.message.author.id) return interaction.reply({ conent: 'Hata! Kendini atamazsın.', empheral: true });
		if (user.id === interaction.client.user.id) return interaction.reply({ conent: 'Hata! Beni atamazsın.', empheral: true });

		// check if the target is higher than the author
		if (user.roles.highest.position >= interaction.message.member.roles.highest.position) return interaction.reply({ conent: 'Hata! Bu kişi senden yüksek bir role sahip.', empheral: true });

		const sebep = interaction.options.getString('sebep');
		if (isNaN(sebep)) sebep = 'Sebep belirtilmedi.';
		sebep = sebep.replace(/\n/g, ' ');
		sebep = `${sebep} | ${interaction.message.author.tag}`;


	},
};
