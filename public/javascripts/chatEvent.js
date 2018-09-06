$(() => {
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
    $("#m").val("");
    return false;
  });
  socket.on("message", function(data) {
    let date = moment(new Date()).format("ddd h:mm");
    if ((data.name = name)) {
      $("#messages").append(
        $(
          `<div class='message-container'><div class='inline-message self'>${date} Me: ${
            data.msg
          }</div></div>`
        )
      );
    } else {
      $("#messages").append(
        $(
          `<div class='message-container'><div class='inline-message other'>${date}" "${
            data.name
          }: ${data.msg}</div></div>`
        )
      );
    }
    scrollToBottom();
  });

  socket.on("init", function(messages) {
    $("#messages").empty();
    for (const msg of messages) {
      const date = moment(new Date(msg.date)).format("ddd h:mm");
      if (msg.from === senderId) {
        $("#messages").append(
          $(
            `<div class='message-container'><div class='inline-message self'>${date} Me: ${
              msg.content
            }</div></div>`
          )
        );
      } else {
        $("#messages").append(
          $(
            `<div class='message-container'><div class='inline-message other'>${date} ${
              msg.name
            }: ${msg.content}</div></div>`
          )
        );
      }
    }
    scrollToBottom();
  });
});

function scrollToBottom() {
  var out = $("#messages");
  out.scrollTop(out.prop("scrollHeight"));
}
