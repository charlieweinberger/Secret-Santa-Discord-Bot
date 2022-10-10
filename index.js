import { Client, Collection, Intents, MessageEmbed, MessageActionRow, MessageButton } from 'discord.js';
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

const participants = {};
let order = [];
let state = "";
let assigned = false;

client.once("ready", () => {

    console.log("Bot is ready!")

    const guildID = "849914162216960021";
    const guild = client.guilds.cache.get(guildID);
    let commands = guild ? guild.commands : client.application?.commands;

    commands?.create({
        name: "secret-santa",
        description: "Start a game of Secret Santa!"
    })

});

client.on("interactionCreate", async (interaction) => {

    if (interaction.isCommand()) {

        startGameEmbed(interaction);
        startGameDMEmbed(interaction);

    } else if (interaction.isButton()) {

        const { customId, user } = interaction;

        await interaction.deferUpdate();

        if (customId == "join") {

            joinEmbed(user);
            state = "create name";

            participants[user.id] = {
                "id": user.id,
                "username": `${user.username}#${user.discriminator}`,
                "name": "",
                "preferences": ""
            };
            
        } else if (customId == "review info") {

            reviewInfoEmbed(user);
            state = "";

        } else if (customId == "edit name") {
            
            editNameEmbed(user);
            state = "edit name";

        } else if (customId == "edit preferences") {

            editPreferencesEmbed(user);
            state = "edit preferences";

        } else if (customId == "confirm assign") {

            confirmAssignEmbed(user);

        } else if (customId == "assign") {

            order = Object.keys(participants);

            for (let i = order.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [order[i], order[j]] = [order[j], order[i]];
            }
        
            for (let i = 0; i < order.length; i++) {
                client.users.fetch(order[i]).then(async (user) => {
                    const j = i == 0 ? order.length - 1 : i - 1;
                    assignEmbed(user, participants[order[j]]);
                });
            }

            assigned = true;

        } else if (customId == "chat with gifter") {

            chatEmbed(user, "gifter");
            state = "chat with gifter";

        } else if (customId == "chat with giftee") {

            chatEmbed(user, "giftee");
            state = "chat with giftee";

        }

    }

});

client.on('messageCreate', async (message) => {
    
    if (message.author.bot || message.channel.type != 'DM') return;

    const user = message.author;
    const participant = participants[user.id];

    if (state == "create name") {

        participant['name'] = message.content;
        createPreferencesEmbed(user);
        state = "edit preferences";

    } else if (state == "edit preferences") {

        participant['preferences'] = message.content;

        if (!assigned) {
            reviewInfoEmbed(user);
        } else {
            
            editPreferencesAfterAssignEmbed(user);
            
            const i = order.indexOf(user.id);
            const gifteeParticipant = participants[order[i == 0 ? order.length - 1 : i - 1]];
            
            client.users.fetch(gifteeParticipant["id"]).then(async (giftee) => {
                updatePreferencesForGifteeEmbed(user, giftee);
            });
            
        }

    } else if (state == "edit name") {

        participant['name'] = message.content;
        reviewInfoEmbed(user);

    } else if (state == "chat with gifter") {

        confirmChatSentEmbed(user, message.content, "gifter");

        const i = order.indexOf(user.id);
        const gifterParticipant = participants[order[i == order.length - 1 ? 0 : i + 1]];

        client.users.fetch(gifterParticipant["id"]).then(async (gifter) => {
            sendChatEmbed(gifter, message.content, "giftee");
        });

    } else if (state == "chat with giftee") {

        confirmChatSentEmbed(user, message.content, "giftee");

        const i = order.indexOf(user.id);
        const gifteeParticipant = participants[order[i == 0 ? order.length - 1 : i - 1]];
        
        client.users.fetch(gifteeParticipant["id"]).then(async (giftee) => {
            sendChatEmbed(giftee, message.content, "gifter");
        });

    }

});

client.login(process.env.TOKEN);

async function startGameDMEmbed(interaction) {

    const embed = new MessageEmbed()
        .setTitle("Secret Santa")
        .setDescription("You just started a game of Secret Santa. Tell your friends to click the blue button to join the game. To randomly assign everyone a partner, press the button below.");

    const components = new MessageActionRow().addComponents(
        new MessageButton()
            .setCustomId("confirm assign")
            .setLabel("Assign")
            .setStyle("PRIMARY")
    );

    await interaction.user.send({
        embeds: [embed],
        components: [components]
    });

}

async function startGameEmbed(interaction) {

    const embed = new MessageEmbed()
        .setTitle("Secret Santa")
        .setDescription("Play Secret Santa!");
    
    const components = new MessageActionRow().addComponents(
        new MessageButton()
            .setCustomId("join")
            .setLabel("Join")
            .setStyle("PRIMARY")
    );

    await interaction.reply({
        embeds: [embed],
        components: [components]
    });

}

async function joinEmbed(user) {

    await user.send({
        embeds: [
            new MessageEmbed()
                .setTitle("Secret Santa")
                .setDescription("You just joined a game of secret santa. To play, please enter your name.")
        ]
    });

}

async function editNameEmbed(user) {

    await user.send({
        embeds: [
            new MessageEmbed()
                .setTitle("Secret Santa")
                .setDescription("Please enter your new name below.")
        ]
    });

}

async function editPreferencesEmbed(user) {

    const embed = new MessageEmbed()
        .setTitle("Secret Santa")
        .setDescription("Here are your current preferences. Please type your new preferences below.")
        .addFields([
            {
                name: "Preferences",
                value: participants[user.id]["preferences"],
            }
        ]);

    await user.send({
        embeds: [embed]
    });

}

async function assignEmbed(user, giftee) {

    const embed = new MessageEmbed()
        .setTitle("Secret Santa")
        .setDescription(`You have been assigned to get a gift for: ${giftee["name"]} (${giftee["username"]}). Here are their preferences. To edit your preferences, chat anonymously with your gifter, or chat with this person, click the buttons below.`)
        .addFields([
            {
                name: "Preferences",
                value: giftee["preferences"],
            }
        ]);

    const components = new MessageActionRow().addComponents(
        new MessageButton()
            .setCustomId("edit preferences")
            .setLabel("Edit Preferences")
            .setStyle("PRIMARY"),
        new MessageButton()
            .setCustomId("chat with gifter")
            .setLabel("Chat With Gifter")
            .setStyle("PRIMARY"),
        new MessageButton()
            .setCustomId("chat with giftee")
            .setLabel("Chat With Giftee")
            .setStyle("PRIMARY")
    );

    await user.send({
        embeds: [embed],
        components: [components]
    });

}

async function confirmAssignEmbed(user) {

    let nameListString = "";
    let usernameListString = "";
    for (const participant of Object.values(participants)) {
        nameListString += `${participant['name']}\n`;
        usernameListString += `${participant['username']}\n`
    }

    const embed = new MessageEmbed()
    .setTitle("Assign players a partner")
    .setDescription("You are about to assign each player a person to get a gift for. The current list of players is shown below. Do you want to start?")
    .addFields([
        {
            name: "Name",
            value: nameListString,
            inline: true
        },
        {
            name: "Username",
            value: usernameListString,
            inline: true
        }
    ]);

    const components = new MessageActionRow().addComponents(
        new MessageButton()
            .setCustomId("assign")
            .setLabel("Yes")
            .setStyle("PRIMARY")
    );

    await user.send({
        embeds: [embed],
        components: [components]
    });

}

async function createPreferencesEmbed(user) {

    const embed = new MessageEmbed()
        .setTitle("Secret Santa")
        .setDescription("Now, describe what gifts you would or would not like to recieve, or any restrictions you have.");

    await user.send({
        embeds: [embed]
    });

}

async function editPreferencesAfterAssignEmbed(user) {

    const embed = new MessageEmbed()
        .setTitle("Secret Santa")
        .setDescription("Here are your new preferences. Your giftee will receive the updated preferences.")
        .addFields([
            {
                name: "Preferences",
                value: participants[user.id]["preferences"],
            }
        ]);

    await user.send({
        embeds: [embed]
    });

}

async function chatEmbed(user, person) {

    const embed = new MessageEmbed()
        .setTitle("Secret Santa")
        .setDescription(`You can chat with your ${person} here. They will receive whatever you type below.`);

    await user.send({
        embeds: [embed]
    });

}

async function confirmChatSentEmbed(user, message, person) {

    const embed = new MessageEmbed()
        .setTitle("Secret Santa")
        .setDescription(`Here is the message your ${person} will receive.`)
        .addFields([
            {
                name: "Message",
                value: message,
            }
        ]);

    await user.send({
        embeds: [embed]
    });

}

async function sendChatEmbed(user, message, person) {

    const embed = new MessageEmbed()
        .setTitle("Secret Santa")
        .setDescription(`Your ${person} has sent you a message. Click the button below to respond.`)
        .addFields([
            {
                name: "Message",
                value: message
            }
        ]);

    let personLabel;
    if (person == "gifter") personLabel = "Gifter";
    if (person == "giftee") personLabel = "Giftee";

    const components = new MessageActionRow().addComponents(
        new MessageButton()
            .setCustomId(`chat with ${person}`)
            .setLabel(`Chat With ${personLabel}`)
            .setStyle("PRIMARY")
    );

    await user.send({
        embeds: [embed],
        components: [components]
    });

}

async function updatePreferencesForGifteeEmbed(user, giftee) {

    const embed = new MessageEmbed()
        .setTitle("Secret Santa")
        .setDescription("Your gifter has updated their preferences. Here are their new preferences.")
        .addFields([
            {
                name: "Preferences",
                value: participants[user.id]["preferences"]
            }
        ]);

    await giftee.send({
        embeds: [embed]
    });

}

async function reviewInfoEmbed(user) {

    const embed = new MessageEmbed()
        .setTitle("Your Name & Preferences")
        .setDescription("Here are your name and gift preferences. To edit your name or preferences, click the buttons below.")
        .addFields([
            {
                name: "Name",
                value: participants[user.id]["name"],
                inline: true
            },
            {
                name: "Preferences",
                value: participants[user.id]["preferences"],
                inline: true
            }
    ]);

    const components = new MessageActionRow().addComponents(
        new MessageButton()
            .setCustomId("edit name")
            .setLabel("Edit Name")
            .setStyle("PRIMARY"),
        new MessageButton()
            .setCustomId("edit preferences")
            .setLabel("Edit Preferences")
            .setStyle("PRIMARY")
    );

    await user.send({
        embeds: [embed],
        components: [components]
    });

}