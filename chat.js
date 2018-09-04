$(function() {
  // var socket = io.connect("http://localhost:3000");
  const socket = io("http://localhost:3000/events");
  $("form").submit(function() {
    socket.emit("message", $("#m").val());
    $("#m").val("");
    return false;
  });
  socket.on("message", function(msg) {
    $("#messages").append($("<li>").text(msg));
  });
});
