$(function() {
  // Connect
  const myId = $("#sender").val();
  const socket = io("http://localhost:3000");
  const options = { weekday: "short", hour: "numeric", minute: "numeric" };
  socket.on("connect", function() {
    socket.emit("userid", { sender: myId, receiver: $("#receiver").val() });
  });

  // $("#m").bind("keyup", () => {
  //   socket.emit("typing");
  // });
  $("form").submit(function() {
    let date = Date.now();
    //date = date.toLocaleDateString("en-US", options);
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
      const date = new Date(msg.date).toLocaleDateString("en-US", options);
      if (msg.from === myId) {
        $("#messages").append($("<li>").text(date + " My: " + msg.content));
      } else {
        $("#messages").append($("<li>").text(date + ": " + msg.content));
      }
    }
  });
});
