import DiscordJS, { Intents } from 'discord.js';
import dotenv from 'dotenv';
dotenv.config();

const client = new DiscordJS.Client({
    intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES]
});

client.on('ready', () => {

    console.log('Bot is ready!');

    const guildId = '849914162216960021';
    const guild = client.guilds.cache.get(guildId);
    let commands = guild ? guild.commands : client.application?.commands;

    commands?.create({
        name: 'hello',
        description: 'says hi!'
    });

    commands?.create({
        name: 'add',
        description: 'adds numbers',
        options: [
            {
                name: 'num1',
                description: 'The first number.',
                required: true,
                type: DiscordJS.Constants.ApplicationCommandOptionTypes.NUMBER
            }, {
                name: 'num2',
                description: 'The second number.',
                required: true,
                type: DiscordJS.Constants.ApplicationCommandOptionTypes.NUMBER
            }, {
                name: 'num3',
                description: 'The third number.',
                required: false,
                type: DiscordJS.Constants.ApplicationCommandOptionTypes.NUMBER
            }
        ]
    });

});

client.on('interactionCreate', async (interaction) => {

    if (!interaction.isCommand()) return;

    const {commandName, options } = interaction;

    if (commandName === 'hello') {

        interaction.reply({
            content: 'hi'
        });

    } else if (commandName === 'add') {

        const num1 = options.getNumber('num1') || 0;
        const num2 = options.getNumber('num2') || 0;
        const num3 = options.getNumber('num3') || 0;

        interaction.reply({
            content: `The sum is ${num1 + num2 + num3}`
        });

    }

});

client.login(process.env.TOKEN);