const express = require("express");
const {ElasticClient} = require("./elasticClient");
const {createServer} = require("http");
const cors = require('cors');
const {Server} = require("socket.io");
const giveMeAJoke = require('give-me-a-joke');
const app = express();
app.use(cors());
const httpServer = createServer(app);
const messageTemplates = require('./message-templates');

const io = new Server(httpServer, {cors: {origin: 'http://localhost:8000'}});
const {Client} = require('@elastic/elasticsearch');

const client = new Client({
    cloud: {
        id: 'My_deployment:dXMtY2VudHJhbDEuZ2NwLmNsb3VkLmVzLmlvJGE5MDQ0ODE2N2RlZjRkYWE4NGE3NzVkMjNiMTI1ZTRlJDA3NjYwMzJjMTEyNjQ0ZDM4NTI1ZjlkYWFiNDk5YTc4',
    },
    auth: {
        username: 'elastic',
        password: 'cGdHxripKzTPQze75TsD7VV7'
    }
});
const bot = {username: 'RobbieBOT', isBot: true}

/**
 * globals
 * */
let chatMembers = [bot];
/** maps needs redis implementation */
const chatMembersMap = new Map();
const messages = [];
const messagesMap = new Map();
const typingUsersMap = new Map();
/**
 * End Globals
 * */

const elasticClient = new ElasticClient(client);

io.on("connection", (socket) => {
    socket.on('user-connected', username => {
        console.log('user-connected');
        chatMembers.push({id: socket.id, username});
        chatMembersMap.set(socket.id, username);
        io.emit('members-update', chatMembers);
        socket.broadcast.emit('new-message', {
            id: Date.now(),
            username: bot.username,
            message: `${username} joined the room`,
            isBot: true
        });
        giveMeAJoke.getRandomCNJoke((joke) => {
            io.to(socket.id).emit('new-message', {
                id: Date.now,
                username: bot.username,
                message: messageTemplates.GREETING({username, joke}),
                isBot: true
            });
        })
        // io.to(socket.id).emit('history', messages); // enable if we need the history;
    });

    socket.on('new-message', async (data) => {
        if (data.message === messageTemplates.TELL_JOKE()) {
            giveMeAJoke.getRandomCNJoke((joke) => {
                io.to(socket.id).emit('new-message', {
                    id: Date.now, username: bot.username, message:
                        `So here's another funny joke:\n ${joke}`, isBot: true
                });
            });
            return;
        }
        const newMessage = {...data, username: chatMembersMap.get(socket.id), id: Date.now()}
        messagesMap.set(newMessage.id, newMessage);
        const isReply = !!data.replyToMessageId;
        if (isReply) {
            const originalMessage = messagesMap.get(data.replyToMessageId);
            newMessage.originalMessage = originalMessage;
        }
        messages.push(newMessage);
        io.emit('new-message', newMessage);
        try {
            await elasticClient.createMessageDoc(newMessage);
            if (!isReply) {
                /** if it's not a reply then we search for existing answers */
                const result = await elasticClient.getExistingAnswers(newMessage.message);
                if (result) {
                    io.to(socket.id).emit('new-message', {
                        message: messageTemplates.FOUND_POSSIBLE_ANSWER(result),
                        username: bot.username,
                        isBot: true,
                        originalMessage: newMessage
                    });
                }
            }
        } catch (error) {
            console.log(error);
        }
    });

    // to do - remove on disconnect;
    socket.on('disconnect', () => {
        console.log('user disconnected');
        console.log(socket.id, chatMembers);
        chatMembers = chatMembers.filter(({id}) => id !== socket.id);
        chatMembersMap.delete(socket.id);
        io.emit('members-update', chatMembers);
    });

    socket.on('typing', () => {
        clearTimeout(typingUsersMap.get(socket.id));
        const timeoutId = setTimeout(() => {
            typingUsersMap.delete(socket.id);
            socket.broadcast.emit('typing', Array.from(typingUsersMap).map(([socketId]) => chatMembersMap.get(socketId)));
        }, 4000);
        typingUsersMap.set(socket.id, timeoutId);
        socket.broadcast.emit('typing', Array.from(typingUsersMap).map(([socketId]) => chatMembersMap.get(socketId)));
    });
});


httpServer.listen(3000, () => {
    console.log('server running on 3000');
});
