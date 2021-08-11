const express = require("express");
const app = express();
const http = require("http").Server(app);
const io = require("socket.io")(http);
const {resolve} = require("path");
const conf = require('./conf')

app.use("/", express.static(resolve(__dirname, "../frontend/")));
app.use("/video", express.static(conf.video));


io.on("connection", function (socket) {
  console.log("a user connected");

  //响应某用户发送消息
  socket.on("play", function (msg) {
    console.log("chat message:" + msg);

    // 广播给所有人
    io.emit("play", msg);
  });

  socket.on("disconnect", function () {
    console.log("user disconnected");
  });
});

http.listen(3000, function () {
  console.log("listening on *:3000");
});
