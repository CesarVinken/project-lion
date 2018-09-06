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
    $("#messages").append(
      $(
        `<div class='message-container'><div class='inline-message self'>${date} My: ${$(
          "#m"
        ).val()}</div></div>`
      )
    );
    $("#m").val("");
    return false;
  });
  socket.on("message", function(msg) {
    $("#messages").append(
      $(
        `<div class='message-container'><div class='inline-message other'>${msg}</div></div>`
      )
    );
  });

  socket.on("init", function(messages) {
    $("#messages").empty();
    for (const msg of messages) {
      const date = moment(new Date(msg.date)).format("ddd h:mm");
      if (msg.from === myId) {
        $("#messages").append(
          $(
            `<div class='message-container'><div class='inline-message self'>${date} My: ${
              msg.content
            }</div></div>`
          )
        );
      } else {
        $("#messages").append(
          $(
            `<div class='message-container'><div class='inline-message other'>${date}: ${
              msg.content
            }</div></div>`
          )
        );
      }
    }
  });
});
