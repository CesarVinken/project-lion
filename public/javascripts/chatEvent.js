$(function() {
  // Connect
  const senderId = $("#sender").val();
  const eventId = $("#receiver").val();
  const name = $("#name").val();
  const socket = io("/events");
  socket.on("connect", function() {
    socket.emit("join", { senderId, eventId, name });
  });
  $("form").submit(function() {
    socket.emit("message", $("#m").val());
    // $("#messages").append($("<li>").text(date + " My: " + $("#m").val()));
    $("#m").val("");
    return false;
  });
  socket.on("message", function(data) {
    let date = moment(new Date()).format("ddd h:mm");
    if ((data.name = name)) {
      $("#messages").append($("<li>").text(date + " Me : " + data.msg));
    } else {
      $("#messages").append($("<li>").text(date + " " + data.name + ": " + data.msg));
    }
  });

  socket.on("init", function(messages) {
    $("#messages").empty();
    for (const msg of messages) {
      const date = moment(new Date(msg.date)).format("ddd h:mm");
      if (msg.from === senderId) {
        $("#messages").append($("<li>").text(date + " Me:" + msg.content));
      } else {
        $("#messages").append($("<li>").text(date + " " + msg.name + ": " + msg.content));
      }
    }
  });
});
