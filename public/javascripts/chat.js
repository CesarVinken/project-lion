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
        `<div class='message-container'><div class='inline-message self'>${$(
          "#m"
        ).val()}</div><p class="small">${date}</p></div>`
      )
    );
    $("#m").val("");
    scrollToBottom();
    return false;
  });
  socket.on("message", function(data) {
    $("#messages").append(
      $(
        `<div class='message-container'><div class='inline-message other'>${
          data.msg
        }</div><p class="small">${data.date}</p></div>`
      )
    );
    scrollToBottom();
  });

  socket.on("init", function(messages) {
    $("#messages").empty();
    for (const msg of messages) {
      const date = moment(new Date(msg.date)).format("ddd h:mm");
      if (msg.from === myId) {
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
              msg.content
            }</div><p class="small">${date}</p></div>`
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
