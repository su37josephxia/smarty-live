const fs = require("fs");
const http = require("http");
const url = require("url");
const path = require("path");

const list = ["../1.mp4", "../2.mp4"];
let i = 1;

http
  .createServer((req, res) => {
    console.log("req:", req.url);
    if (req.url === "/") {
      // res.writeHead(200, { "Content-Type": "text/html" });
      // res.end('<video src="/v" autoplay="autoplay"></video>');
      const html = fs.readFileSync("./index.html");
      res.end(html);
    } else if (req.url === "/next") {
      i++;
    } else if (req.url.indexOf("/v") !== -1) {
      console.log("播放：");
      var file = path.resolve(__dirname, "../../assets/1.mp4");
      fs.stat(file, function (err, stats) {
        if (err) {
          if (err.code === "ENOENT") {
            // 404 Error if file not found
            return res.sendStatus(404);
          }
          res.end(err);
        }
        var range = req.headers.range;
        if (!range) {
          // 416 Wrong range
          return res.sendStatus(416);
        }
        var positions = range.replace(/bytes=/, "").split("-");
        var start = parseInt(positions[0], 10);
        var total = stats.size;
        var end = positions[1] ? parseInt(positions[1], 10) : total - 1;
        var chunksize = end - start + 1;

        res.writeHead(206, {
          "Content-Range": "bytes " + start + "-" + end + "/" + total,
          "Accept-Ranges": "bytes",
          "Content-Length": chunksize,
          "Content-Type": "video/mp4",
        });

        var stream = fs
          .createReadStream(file, { start: start, end: end })
          .on("open", function () {
            stream.pipe(res);
          })
          .on("error", function (err) {
            res.end(err);
          });
      });
    }
  })
  .listen(3001);
