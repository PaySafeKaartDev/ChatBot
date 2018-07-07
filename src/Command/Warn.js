const Command = require('../Command');

module.exports = Command.extend({
    commandName: 'warn',
    advertisable: false,
    processMessage: function (message, tokens) {
        let hasRoles = message.member !== null && typeof message.member.roles !== 'undefined';

        if (hasRoles && this.memberIsAdministrator(message.member)) {
            message.delete();

            let victim = message.mentions.members.first();

            if (tokens.length < 3 || !victim) {
                message.member.user.send('Please use the correct format: `!warn <@User#9999> <Reason>`.');
            }
            else {
                let reason = tokens.slice(2).join(' ');

                if (!reason || reason == '' || reason == null) {
                    message.member.user.send('Please use the correct format: `!warn <@User#9999> <Reason>`.');
                } else {
                    message.member.user.send({
                        embed: {
                            color: 0xff0000,
                            author: {
                                name: this.discordClient.user.username,
                                icon_url: this.discordClient.user.avatarURL
                            },
                            title: "Successfully warned " + victim.user.username,
                            fields: [
                            {
                                name: "Warn Reason",
                                value: reason
                            }
                            ],
                            timestamp: new Date(),
                            footer: {
                                icon_url: this.discordClient.user.avatarURL,
                                text: "Shotbow Network Chat Bot"
                            }
                        }
                    });

                    victim.user.send({
                        embed: {
                            color: 0xff0000,
                            author: {
                                name: this.discordClient.user.username,
                                icon_url: this.discordClient.user.avatarURL
                            },
                            title: "You have been warned on the Shotbow Discord",
                            fields: [
                            {
                                name: "Warn Reason",
                                value: reason
                            }
                            ],
                            timestamp: new Date(),
                            footer: {
                                icon_url: this.discordClient.user.avatarURL,
                                text: "Shotbow Network Chat Bot"
                            }
                        }
                    })
                        .catch(error => message.member.user.send('In addition, I was unable to DM the banned user about their ban. It is likely that they have DMs disabled.'));
                }
            }
        }
    },
    memberIsAdministrator: function (member) {
        for (let role in this.config.administrator_roles) {
            if (member.roles.has(this.config.administrator_roles[role])) {
                return true;
            }
        }
        return false;
    }
});
