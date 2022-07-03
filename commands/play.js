const { GuildMember, Interaction } = require("discord.js");
const {
	entersState,
	joinVoiceChannel,
	VoiceConnectionStatus,
} =  require('@discordjs/voice');
const MusicSubscription = require('../music/subscription');
const Track = require('../music/track');
const { SlashCommandBuilder } = require("@discordjs/builders");

module.exports = {
	data: new SlashCommandBuilder()
		.setName("play")
		.setDescription("Riproduce una canzone da un URL di YouTube")
		.addStringOption((option) =>
			option.setName("url").setDescription("URL di YouTube").setRequired(true)
		),
	async execute(interaction, subscriptions, subscription) {
    await interaction.deferReply({ ephemeral: true });
    
		const url = interaction.options.get("url")?.value;

		if (!subscription) {
			if (
				interaction.member instanceof GuildMember &&
				interaction.member.voice.channel
			) {
				const channel = interaction.member.voice.channel;
				subscription = new MusicSubscription(
					joinVoiceChannel({
						channelId: channel.id,
						guildId: channel.guild.id,
						adapterCreator: channel.guild.voiceAdapterCreator,
					})
				);
				subscription.voiceConnection.on("error", console.warn);
				subscriptions.set(interaction.guildId, subscription);
			}
		}

		// If there is no subscription, tell the user they need to join a channel.
		if (!subscription) {
			await interaction.followUp(
				"Devi entrare in un canale vocale per eseguire questo comando"
			);
			return;
		}

		// Make sure the connection is ready before processing the user's request
		try {
			await entersState(
				subscription.voiceConnection,
				VoiceConnectionStatus.Ready,
				20e3
			);
		} catch (error) {
			console.warn(error);
			await interaction.followUp(
				"Non essere triste, non sono riuscito a entrare nel canale"
			);
			return;
		}

		try {
			// Attempt to create a Track from the user's video URL
			const track = await Track.from(url, {
				onStart() {
					interaction
						.followUp({ content: `Vuole sentire: \n ${url}` })
						.catch(console.warn);
				},
				onFinish() {
					subscription.processQueue();
					console.log('Song finished playing');
				},
				onError(error) {
					console.warn(error);
					interaction
						.followUp({ content: `Errore: ${error.message}`, ephemeral: true })
						.catch(console.warn);
				},
			});
			// Enqueue the track and reply a success message to the user
			subscription.enqueue(track);
			await interaction.followUp(`Ho aggiunto in coda **${track.title}**`);
		} catch (error) {
			console.warn(error);
			await interaction.followUp(
				`Uffa, non sono riuscito a aggiungere in coda questa canzone`
			);
		}
	},
};
