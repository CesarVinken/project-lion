const Message = require("../models/Message");
const Util = require("../utils/util");

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
  var private = io.of("/private");
  nsp.on("connection", function(socket) {
    console.log("user connected to events");
    // join room
    socket.on("join", function(data) {
      console.log("join", data.eventId);
      socket.join(data.eventId);
      socket.dbId = data.senderId;
      socket.eventId = data.eventId;
      socket.userName = data.name;
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
      console.log("message from " + socket.dbId + " to " + socket.eventId);
      let name = socket.userName;
      nsp.to(socket.eventId).emit("message", { msg, name });
      Message.create(
        {
          from: socket.dbId,
          to: socket.evenId,
          name: name,
          type: "Event",
          content: msg,
          date: new Date(),
          delivered: true
        },
        function(err, message) {
          if (err) return console.log(err.message);
        }
      );
    });
    // disconnect
    socket.on("disconnect", function() {
      console.log("user disconnected");
      console.log(clients);
    });
  });

  private.on("connection", function(socket) {
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
          private.to(`${client.ioId}`).emit("init", messages);
        });
    });
    // disconnect
    socket.on("disconnect", function() {
      removeClient(socket);
      console.log("user disconnected");
    });
    // message
    socket.on("message", function(msg) {
      const client = clients.get(socket.dbId);
      Util.updateActivity(client.receiverDbId, socket.dbId);
      if (client.receiverOn) {
        private.to(`${client.receiverIoId}`).emit("message", msg);
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
