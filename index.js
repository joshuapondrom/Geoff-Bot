const discord = require('discord.js');
const client = new discord.Client();
const sql = require('sqlite');
const _ = require('lodash');
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
        prefixedCommand(message, command, args);
    }
    if (message.author.bot) return;
    scoreUpdate(message);
});

function prefixedCommand(message, command, args) {
    if (command === "score") {
        sql.get(`SELECT * FROM scores WHERE userId = "${message.author.id}"`).then(row => {
            if (!row) return message.reply("You have 0 points");
            message.reply(`You have ${row.points} points`);
        });
    } else if (command === "rps") {
        if (args.length != 1) {
            message.reply("Invalid choice, try again.");
        }
        let choices = ['r', 'p', 's'];
        let choice = args[0].charAt(0).toLowerCase();
        computerChoice = _.sample(choices);
        console.log(choice, choices, computerChoice);
        if (choices.indexOf(choice) === -1) {
            message.reply("Invalid choice, try again.");
        } else if (choice === computerChoice) {
            message.reply("We tied.");
        } else if ((choice === 'r' && computerChoice === 'p') ||
                   (choice === 'p' && computerChoice === 's') ||
                   (choice === 's' && computerChoice === 'r')) {
            message.reply("You lost.");
        } else {
            message.reply("You won!");
        }
    } else if (command === "flip") {
        let outcome = ['Heads', 'Tails'];
        message.reply(_.sample(outcome));
    }
}

function scoreUpdate(message) {
    sql.get(`SELECT * FROM scores WHERE userID = "${message.author.id}"`).then(row => {
        if (!row) {
            sql.run("INSERT INTO scores (userId, points, level) VALUES (?, ?, ?)", [message.author.id, 1, 0]);
        } else {
            sql.run(`UPDATE scores SET points = ${row.points + 1} WHERE userID = ${message.author.id}`);
        }
    }).catch(() => {
        console.error;
        sql.run("CREATE TABLE IF NOT EXISTS scores (userId TEXT, points INTEGER, level INTEGER)").then(() => {
            sql.run("INSERT INTO scores (userId, points, level) VALUES (?, ?, ?)", [message.author.id, 1, 0]);
        });
    });
}

client.login(token);