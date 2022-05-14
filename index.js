import DiscordJS, { Intents } from 'discord.js';
import dotenv from 'dotenv';
dotenv.config();
import { allCommands } from './commands.js';

const client = new DiscordJS.Client({
    intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES]
});

client.on('ready', () => {

    console.log('Bot is ready!');

    const guildId = '849914162216960021';
    const guild = client.guilds.cache.get(guildId);
    let commands = guild ? guild.commands : client.application?.commands;

    for (const command of allCommands) {

        commands?.create({
            name: command.name,
            description: command.description,
            options: command.options
        });

    }

});

client.on('interactionCreate', async (interaction) => {

    if (!interaction.isCommand()) return;

    const {commandName, options } = interaction;

    allCommands.filter(command => commandName === command.name)[0]
               .do(interaction, options);

});

client.login(process.env.TOKEN);