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
          `<div class='message-container'><div class='inline-message self'>${
            data.msg
          }</div><p class="small">${date}</p></div>`
        )
      );
    } else {
      $("#messages").append(
        $(
          `<div class='message-container'><div class='inline-message other'>${
            data.name
          }: ${data.msg}</div><p class="small">${date}</p></div>`
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
            `<div class='message-container'><div class='inline-message self'>${
              msg.content
            }</div><p class="small">${date}</p></div>`
          )
        );
      } else {
        $("#messages").append(
          $(
            `<div class='message-container'><div class='inline-message other'>${
              msg.name
            }: ${msg.content}</div><p class="small">${date}</p></div>`
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
