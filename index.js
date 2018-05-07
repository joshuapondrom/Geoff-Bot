const discord = require('discord.js');
const client = new discord.Client();
const sql = require('sqlite');
sql.open('./score.sqlite');

const config = require('./config.json');
prefix = config.prefix;
token = config.token;

client.on('ready', () => {
    console.log('Bot is running!');
});

client.on('message', async message => {
    if (message.content.startsWith(prefix)) {
        const args = message.content.slice(prefix.length).split(/ +/);
        const command = args.shift().toLowerCase();
        if (command === "score") {
            sql.get(`SELECT * FROM scores WHERE userId = "${message.author.id}"`).then(row => {
                if (!row) return message.reply("You have 0 points");
                message.reply(`You have ${row.points} points`);
            })
        }
    }
    if (message.author.bot || message.channel.type === "dm") return;
    sql.get(`SELECT * FROM scores WHERE userID = "${message.author.id}"`).then(row => {
        if (!row) {
            sql.run("INSERT INTO score (userId, points, level) VALUES (?, ?, ?)", [message.author.id, 1, 0]);
        } else {
            sql.run(`UPDATE scores SET points = ${row.points + 1} WHERE userID = ${message.author.id}`);
        }
    }).catch(() => {
        console.error;
        sql.run("CREATE TABLE IF NOT EXISTS scores (userId TEXT, points INTEGER, level INTEGER)").then(() => {
            sql.run("INSERT INTO score (userId, points, level) VALUES (?, ?, ?)", [message.author.id, 1, 0]);
        });
    });
});

client.login(token);