import { Client, Collection, Intents } from 'discord.js';
import dotenv from 'dotenv';
dotenv.config();

const client = new Client({
    intents: [
        Intents.FLAGS.GUILDS,
        Intents.FLAGS.GUILD_MESSAGES
    ]
});
client.commands = new Collection();

import Hello from './commands/hello.js';
import Bye from './commands/bye.js';
import AddNums from './commands/addNums.js';

const commandMap = {
    'hello': Hello,
    'bye': Bye,
    'add': AddNums
}

// let roles = [];

client.once('ready', () => console.log('Bot is ready!'));

client.on('interactionCreate', async (interaction) => {

    if (interaction.isCommand()) {

        commandMap[interaction.commandName].execute(interaction);
        // } else if (commandName === 'rr') {
            
        //     const title = options.getString('title');
        //     const description = options.getString('description');
            
        //     roles = [
        //         options.getRole('role-1'),
        //         options.getRole('role-2')
        //     ];

        //     const rrEmbed = new MessageEmbed()
        //         .setTitle(title)
        //         .setDescription(description);

        //     const row = new MessageActionRow()
        //         .addComponents(
        //             new MessageButton()
        //                 .setCustomId(`rr-role-1`)
        //                 .setLabel(roles[0].name)
        //                 .setStyle('PRIMARY'),
        //             new MessageButton()
        //                 .setCustomId(`rr-role-2`)
        //                 .setLabel(roles[1].name)
        //                 .setStyle('PRIMARY')
        //         )

        //     interaction.reply({
        //         embeds: [rrEmbed],
        //         components: [row]
        //     });

        // }

	} // else if (interaction.isButton()) {
        
    //     const member = interaction.guild.members.cache.get(interaction.user.id);

    //     if (interaction.customId === 'rr-role-1') {
    //         member.roles.add(roles[0]);
    //         interaction.reply({
    //             content: `Successfully added ${roles[0].name} role`,
    //             ephemeral: true
    //         });
    //     } else if (interaction.customId === 'rr-role-2') {
    //         member.roles.add(roles[1]);
    //         interaction.reply({
    //             content: `Successfully added ${roles[1].name} role`,
    //             ephemeral: true
    //         });
    //     }

    // }

});

client.login(process.env.TOKEN);