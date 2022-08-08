import { Client, Collection, Intents } from 'discord.js';
import { secretSanta, executeMessage } from './secretSanta.js';
import dotenv from 'dotenv';
dotenv.config();

const client = new Client({
    intents: [
        Intents.FLAGS.GUILDS,
        Intents.FLAGS.GUILD_MESSAGES,
        Intents.FLAGS.DIRECT_MESSAGES
    ]
});
client.commands = new Collection();

const commandMap = {
    'hello': secretSanta,
    // 'secretSanta': secretSanta,
}

client.once('ready', () => console.log('Bot is ready!'));

client.on('interactionCreate', async (interaction) => {
    if (interaction.isCommand()) commandMap[interaction.commandName].executeCommand(interaction);
	if (interaction.isButton()) commandMap[interaction.customId.split('-')[0]].executeButton(interaction);
});

client.on('messageCreate', async (message) => {
    if (message.author.bot) return;
    console.log(message.content);
    executeMessage(message);
});

client.login(process.env.TOKEN);

export { client };

/*

/secretsanta

    - gives info about secret santa
    - DMs whoever started the game with a button to start the shuffle
    - has a button to join the game
    
    - if you press the button, you get a DM that:
        1. asks for your name
        2. asks for what you want
        3. gives you a button to edit your wish list

*/