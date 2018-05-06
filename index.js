const discord = require('discord.js');
const client = new discord.Client();

const config = require('./config.json');

client.on('message', async message => {
    if (message.content.startsWith(prefix)) {
        const args = message.content.slice(prefix.length).split(/ +/);
        const command = args.shift().toLowerCase();
    }
});

client.login(config.token);