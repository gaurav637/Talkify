const express = require('express');
const { Server } = require('socket.io');
const http = require('http');
const getUserDetailsFromToken = require('../helpers/getUserDetailsFromToken');
const UserModel = require('../models/UserModel');
const { ConversationModel, MessageModel } = require('../models/ConversationModel');
const getConversation = require('../helpers/getConversation');

const app = express();

// Create HTTP server and Socket.IO server
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: process.env.FRONTEND_URL,
        credentials: true,
    },
});

// Online user set
const onlineUser = new Set();

// Handle new socket connection
io.on('connection', async (socket) => {
    console.log("Connected user", socket.id);

    const token = socket.handshake.auth.token;
    // Handle user connection
    const user = await handleUserConnection(socket, token);
    if (!user) return;

    // Handle message-page event
    socket.on('message-page', async (userId) => {
        try {
            console.log('UserId:', userId);

            // Get user details
            const userDetails = await UserModel.findById(userId).select("-password");
            const payload = {
                _id: userDetails?._id,
                name: userDetails?.name,
                email: userDetails?.email,
                profile_pic: userDetails?.profile_pic,
                online: onlineUser.has(userId),
            };
            socket.emit('message-user', payload);

            // Get previous messages
            const getConversationMessage = await ConversationModel.findOne({
                "$or": [
                    { sender: user?._id, receiver: userId },
                    { sender: userId, receiver: user?._id },
                ],
            }).populate('messages').sort({ updatedAt: -1 });

            socket.emit('message', getConversationMessage?.messages || []);
        } catch (error) {
            console.error('Error in message-page event:', error.message);
        }
    });

    // Handle new message event
    socket.on('new message', async (data) => {
        try {
            // Check if conversation exists
            let conversation = await ConversationModel.findOne({
                "$or": [
                    { sender: data?.sender, receiver: data?.receiver },
                    { sender: data?.receiver, receiver: data?.sender },
                ],
            });

            // Create new conversation if not found
            if (!conversation) {
                conversation = await new ConversationModel({
                    sender: data?.sender,
                    receiver: data?.receiver,
                }).save();
            }

            // Create and save new message
            const message = new MessageModel({
                text: data.text,
                imageUrl: data.imageUrl,
                videoUrl: data.videoUrl,
                msgByUserId: data?.msgByUserId,
            });
            const savedMessage = await message.save();

            // Update conversation with new message
            await ConversationModel.updateOne({ _id: conversation?._id }, {
                "$push": { messages: savedMessage?._id },
            });

            // Get updated conversation messages
            const getConversationMessage = await ConversationModel.findOne({
                "$or": [
                    { sender: data?.sender, receiver: data?.receiver },
                    { sender: data?.receiver, receiver: data?.sender },
                ],
            }).populate('messages').sort({ updatedAt: -1 });

            // Emit messages to both users
            io.to(data?.sender).emit('message', getConversationMessage?.messages || []);
            io.to(data?.receiver).emit('message', getConversationMessage?.messages || []);

            // Send updated conversation to both users
            const conversationSender = await getConversation(data?.sender);
            const conversationReceiver = await getConversation(data?.receiver);

            io.to(data?.sender).emit('conversation', conversationSender);
            io.to(data?.receiver).emit('conversation', conversationReceiver);
        } catch (error) {
            console.error('Error in new message event:', error.message);
        }
    });

    // Handle sidebar event
    socket.on('sidebar', async (currentUserId) => {
        try {
            console.log("Current user:", currentUserId);

            const conversation = await getConversation(currentUserId);
            socket.emit('conversation', conversation);
        } catch (error) {
            console.error('Error in sidebar event:', error.message);
        }
    });

    // Handle seen event
    socket.on('seen', async (msgByUserId) => {
        try {
            let conversation = await ConversationModel.findOne({
                "$or": [
                    { sender: user?._id, receiver: msgByUserId },
                    { sender: msgByUserId, receiver: user?._id },
                ],
            });

            const conversationMessageId = conversation?.messages || [];

            await MessageModel.updateMany(
                { _id: { "$in": conversationMessageId }, msgByUserId: msgByUserId },
                { "$set": { seen: true } }
            );

            // Send updated conversation to both users
            const conversationSender = await getConversation(user?._id?.toString());
            const conversationReceiver = await getConversation(msgByUserId);

            io.to(user?._id?.toString()).emit('conversation', conversationSender);
            io.to(msgByUserId).emit('conversation', conversationReceiver);
        } catch (error) {
            console.error('Error in seen event:', error.message);
        }
    });

    // Handle disconnection
    socket.on('disconnect', () => {
        try {
            onlineUser.delete(user?._id?.toString());
            io.emit('onlineUser', Array.from(onlineUser));
            console.log('User disconnected:', socket.id);
        } catch (error) {
            console.error('Error in disconnect event:', error.message);
        }
    });
});

// Function to handle user connection
async function handleUserConnection(socket, token) {
    try {
        if (!token) throw new Error('Token not provided');

        const user = await getUserDetailsFromToken(token);
        if (!user) throw new Error('User not found');

        socket.join(user._id.toString());
        onlineUser.add(user._id.toString());

        io.emit('onlineUser', Array.from(onlineUser));
        return user;
    } catch (error) {
        console.error('User connection error:', error.message);
        socket.disconnect();
        return null;
    }
}

module.exports = {
    app,
    server,
};
