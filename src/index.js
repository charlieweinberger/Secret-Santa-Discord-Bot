import { Client, Collection, Intents } from 'discord.js';
import Hello from './commands/hello.js';
import Bye from './commands/bye.js';
import AddNums from './commands/addNums.js';
import reactionRoles from './commands/reactionRoles.js';
import buttonResponses from './buttonResponses.js';
import dotenv from 'dotenv';
dotenv.config();

const client = new Client({
    intents: [
        Intents.FLAGS.GUILDS,
        Intents.FLAGS.GUILD_MESSAGES
    ]
});
client.commands = new Collection();

const commandMap = {
    'hello': Hello,
    'bye': Bye,
    'add': AddNums,
    'rr': reactionRoles
}

client.once('ready', () => console.log('Bot is ready!'));

client.on('interactionCreate', async (interaction) => {
    if (interaction.isCommand()) commandMap[interaction.commandName].execute(interaction);
	if (interaction.isButton()) buttonResponses.execute(interaction);
});

client.login(process.env.TOKEN);