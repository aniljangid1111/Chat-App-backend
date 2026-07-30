const { Server } = require("socket.io");
const User = require("../models/user.js");


// Store online users with their socket IDs
const onlineUsers = new Map();


const initSocket = (server, app) => {

    const io = new Server(server, {
        cors: {
            origin: "http://localhost:5173",
            methods: ["GET", "POST"],
        },
    });


    // Make socket instance accessible in controllers
    app.set("io", io);


    io.on("connection", (socket) => {

        console.log("Connected :", socket.id);


        /*
            Setup user socket connection

            Working:
            - Store userId with socketId
            - Mark user as online
            - Join private user room
            - Notify all users
        */

        socket.on("setup", async (user) => {

            console.log("SETUP:", user._id);

            const oldSocket = onlineUsers.get(user._id.toString());

            // If user already has an active socket connection
            if (oldSocket) {
                console.log("Replacing old socket:", oldSocket);
            }


            // Store userId and socketId mapping
            onlineUsers.set(user._id.toString(), socket.id);


            console.log("ONLINE USERS:", [...onlineUsers.keys()]);


            // Save user id inside socket
            socket.userId = user._id.toString();


            // Create private room for user
            socket.join(user._id);


            // Update user online status
            await User.findByIdAndUpdate(user._id, {
                isOnline: true,
            });


            console.log("EMIT ONLINE:", user._id);


            // Notify users that user is online
            io.emit("user online", user._id);


            // Send online users list
            io.emit("online users", [...onlineUsers.keys()]);


            socket.emit("connected");

        });



        /*
            Join Chat Room

            Working:
            - User joins chat room
            - Used for typing and messages events
        */

        socket.on("join chat", (chatId) => {

            socket.join(chatId);

            console.log("Joined Chat :", chatId);

        });



        /*
            Typing Indicator
            Sends typing event to other users in same chat
        */

        socket.on("typing", (chatId) => {

            socket.in(chatId).emit("typing", chatId);

        });

        socket.on("stop typing", (chatId) => {

            socket.in(chatId).emit("stop typing", chatId);

        });

        /*
            Handle Socket Disconnect

            Working:
            - Remove user from online users
            - Update offline status
            - Save last seen time
        */

        socket.on("disconnect", () => {

            const userId = socket.userId;

            console.log("DISCONNECT:", userId);


            if (!userId) return;

            // Wait before marking offline
            // User can reconnect during this time
            setTimeout(async () => {

                const currentSocket = onlineUsers.get(userId);


                // User already reconnected
                if (currentSocket && currentSocket !== socket.id) {

                    console.log("User reconnected:", userId);

                    return;
                }


                // Remove user from online users
                onlineUsers.delete(userId);


                // Update user offline status
                await User.findByIdAndUpdate(userId, {
                    isOnline: false,
                    lastSeen: new Date(),
                });


                console.log("EMIT OFFLINE:", userId);


                // Send updated online users list
                io.emit("online users", [...onlineUsers.keys()]);


                // Notify users about offline status
                io.emit("user offline", {
                    userId,
                    lastSeen: new Date(),
                });


            }, 1500); // Wait 1.5 seconds before marking offline

        });

    });

};


module.exports = initSocket;