let buttonResponses = {
    execute: async (interaction) => {
        
        const { customId } = interaction;

        if (customId.startsWith('rr')) {
            
            const roleId = customId.split('-').at(-1);
            const role = interaction.guild.roles.cache.get(roleId);
            const member = interaction.guild.members.cache.get(interaction.user.id);
            
            member.roles.add(role);

            await interaction.reply({
                content: `Successfully added ${role.name} role`,
                ephemeral: true
            });

        }
    }
}

export { buttonResponses as default };