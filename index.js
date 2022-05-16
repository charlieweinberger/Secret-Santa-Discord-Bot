import { Client, Intents, Constants, MessageEmbed, MessageActionRow, MessageButton } from 'discord.js';
import dotenv from 'dotenv';
dotenv.config();

const client = new Client({
    intents: [
        Intents.FLAGS.GUILDS,
        Intents.FLAGS.GUILD_MESSAGES
    ]
});

let guild;
let roles = [];

client.on('ready', () => {

    console.log('Bot is ready!');

    guild = client.guilds.cache.get('849914162216960021');
    const commands = guild ? guild.commands : client.application?.commands;

    commands.create({
        name: 'hello',
        description: 'says hi!'
    });

    commands.create({
        name: 'add',
        description: 'adds numbers',
        options: [
            {
                name: 'num-1',
                description: 'The first number.',
                required: true,
                type: Constants.ApplicationCommandOptionTypes.NUMBER
            }, {
                name: 'num-2',
                description: 'The second number.',
                required: true,
                type: Constants.ApplicationCommandOptionTypes.NUMBER
            }, {
                name: 'num-3',
                description: 'The third number.',
                required: false,
                type: Constants.ApplicationCommandOptionTypes.NUMBER
            }, {
                name: 'num-4',
                description: 'The fourth number.',
                required: false,
                type: Constants.ApplicationCommandOptionTypes.NUMBER
            }, {
                name: 'num-5',
                description: 'The fifth number.',
                required: false,
                type: Constants.ApplicationCommandOptionTypes.NUMBER
            }, {
                name: 'num-6',
                description: 'The sixth number.',
                required: false,
                type: Constants.ApplicationCommandOptionTypes.NUMBER
            }, {
                name: 'num-7',
                description: 'The seventh number.',
                required: false,
                type: Constants.ApplicationCommandOptionTypes.NUMBER
            }, {
                name: 'num-8',
                description: 'The eigth number.',
                required: false,
                type: Constants.ApplicationCommandOptionTypes.NUMBER
            }, {
                name: 'num-9',
                description: 'The ninth number.',
                required: false,
                type: Constants.ApplicationCommandOptionTypes.NUMBER
            }, {
                name: 'num-10',
                description: 'The tenth number.',
                required: false,
                type: Constants.ApplicationCommandOptionTypes.NUMBER
            }
        ]
    });

    commands.create({
        name: 'rr',
        description: 'create a reaction role(s)',
        options: [
            {
                name: 'title',
                description: 'The title of the reaction role embed.',
                required: true,
                type: Constants.ApplicationCommandOptionTypes.STRING
            }, {
                name: 'role-1',
                description: 'The first role.',
                required: true,
                type: Constants.ApplicationCommandOptionTypes.ROLE
            }, {
                name: 'description',
                description: 'The description of the reaction role embed.',
                required: false,
                type: Constants.ApplicationCommandOptionTypes.STRING
            }, {
                name: 'role-2',
                description: 'The second role.',
                required: false,
                type: Constants.ApplicationCommandOptionTypes.ROLE
            }
        ]
    });

});

client.on('interactionCreate', async (interaction) => {

    if (interaction.isCommand()) {

        const { commandName, options } = interaction;

        if (commandName === 'hello') {

            interaction.reply({
                content: 'hi'
            });

        } else if (commandName === 'add') {

            const num1 = options.getNumber('num-1');
            const num2 = options.getNumber('num-2');
            const num3 = options.getNumber('num-3');
            const num4 = options.getNumber('num-4');
            const num5 = options.getNumber('num-5');
            const num6 = options.getNumber('num-6');
            const num7 = options.getNumber('num-7');
            const num8 = options.getNumber('num-8');
            const num9 = options.getNumber('num-9');
            const num10 = options.getNumber('num-10');

            interaction.reply({
                content: `The sum is ${num1 + num2 + num3 + num4 + num5 +
                                    num6 + num7 + num8 + num9 + num10}`
            });

        } else if (commandName === 'rr') {
            
            const title = options.getString('title');
            const description = options.getString('description');
            
            roles = [
                options.getRole('role-1'),
                options.getRole('role-2')
            ];

            const rrEmbed = new MessageEmbed()
                .setTitle(title)
                .setDescription(description);

            const row = new MessageActionRow()
                .addComponents(
                    new MessageButton()
                        .setCustomId(`rr-role-1`)
                        .setLabel(roles[0].name)
                        .setStyle('PRIMARY'),
                    new MessageButton()
                        .setCustomId(`rr-role-2`)
                        .setLabel(roles[1].name)
                        .setStyle('PRIMARY')
                )

            interaction.reply({
                embeds: [rrEmbed],
                components: [row]
            });

        }

    } else if (interaction.isButton()) {
        
        const member = guild.members.cache.get(interaction.user.id);

        if (interaction.customId === 'rr-role-1') {
            member.roles.add(roles[0]);
            interaction.reply({
                content: `Successfully added ${roles[0].name} role`,
                ephemeral: true
            });
        } else if (interaction.customId === 'rr-role-2') {
            member.roles.add(roles[1]);
            interaction.reply({
                content: `Successfully added ${roles[1].name} role`,
                ephemeral: true
            });
        }

    }

});

client.login(process.env.TOKEN);