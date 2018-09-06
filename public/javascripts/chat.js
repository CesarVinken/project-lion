$(function() {
  // Connect
  const myId = $("#sender").val();
  const socket = io("/private");
  socket.on("connect", function() {
    socket.emit("userid", { sender: myId, receiver: $("#receiver").val() });
  });
  $("form").submit(function() {
    let date = moment(new Date()).format("ddd h:mm");
    socket.emit("message", $("#m").val());
    $("#messages").append($("<li>").text(date + " My: " + $("#m").val()));
    $("#m").val("");
    return false;
  });
  socket.on("message", function(msg) {
    $("#messages").append($("<li>").text(msg));
  });

  socket.on("init", function(messages) {
    $("#messages").empty();
    for (const msg of messages) {
      const date = moment(new Date(msg.date)).format("ddd h:mm");
      if (msg.from === myId) {
        $("#messages").append($("<li>").text(date + " My: " + msg.content));
      } else {
        $("#messages").append($("<li>").text(date + ": " + msg.content));
      }
    }
  });
});
