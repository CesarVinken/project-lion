const Message = require("../models/Message");

// List of all connected clients
const clients = new Map();

const newClient = (socket, data) => {
  const client = {
    dbId: data.sender,
    ioId: socket.id,
    receiverOn: false,
    receiverDbId: data.receiver
  };
  const receiver = clients.get(client.receiverDbId);
  if (receiver != undefined) {
    receiver.receiverOn = true;
    receiver.receiverIoId = client.ioId;
    client.receiverOn = true;
    client.receiverIoId = receiver.ioId;
  }

  clients.set(client.dbId, client);
  return client;
};

const removeClient = socket => {
  client = clients.get(socket.dbId);
  clients.delete(socket.dbId);
  if (client.receiverOn) {
    receiver = clients.get(client.receiverDbId);
    receiver.receiverOn = false;
    delete receiver.receiverIoId;
    clients.set(receiver.dbId, receiver);
  }
};

module.exports = function(http) {
  const io = require("socket.io")(http);
  var nsp = io.of("/events");
  nsp.on("connection", function(socket) {
    console.log("user connected to events");
    // join room
    socket.on("join", function(data) {
      console.log("join", data.senderId);
      socket.join(data.eventId);
      socket.dbId = data.senderId;
      socket.eventId = data.eventId;
      Message.find({
        to: data.EventId
      })
        .limit(100)
        .sort([["date", 1]])
        .then(messages => {
          nsp.to(`${socket.id}`).emit("init", messages);
        });
    });
    // message
    socket.on("message", function(msg) {
      nsp.to("some room").emit("some event");
    });
    // disconnect
    socket.on("disconnect", function() {
      removeClient(socket);
      console.log("user disconnected");
      console.log(clients);
    });
  });

  io.on("connection", function(socket) {
    console.log("user connected");
    // user data
    socket.on("userid", function(data) {
      socket.dbId = data.sender;
      const client = newClient(socket, data);
      Message.find({
        $or: [
          { $and: [{ from: data.sender }, { to: data.receiver }] },
          { $and: [{ from: data.receiver }, { to: data.sender }] }
        ],
        type: "Tandem"
      })
        .limit(100)
        .sort([["date", 1]])
        .then(messages => {
          io.to(`${client.ioId}`).emit("init", messages);
        });
      console.log(clients);
    });
    // join room (event)
    socket.on("join", function(eventId) {
      socket.join("eventId");
    });
    // message (event)
    socket.on("msgEvent", function(msg) {
      io.to("some room").emit("some event");
    });
    // disconnect
    socket.on("disconnect", function() {
      removeClient(socket);
      console.log("user disconnected");
      console.log(clients);
    });
    // message
    socket.on("message", function(msg) {
      const client = clients.get(socket.dbId);
      if (client.receiverOn) {
        io.to(`${client.receiverIoId}`).emit("message", msg);
      }
      Message.create(
        {
          from: client.dbId,
          to: client.receiverDbId,
          type: "Tandem",
          content: msg,
          date: new Date(),
          delivered: client.receiverOn
        },
        function(err, message) {
          if (err) return console.log(err.message);
        }
      );
      console.log("message: " + msg);
    });
    // Typing
    socket.on("typing", function() {
      console.log("typing");
    });
  });
};
