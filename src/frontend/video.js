let i = 0;
//   const video = document.querySelector("#vid");
var video = document.getElementById("vid");

video.src = "/video/1.mp4";
video.play();

video.addEventListener("ended", function () {
  //    video_Status.src="img/play.png";
  console.log("video end...");
  i++;
  // 重新博凡
  video.src = "/video/" + ((i % 2) + 1) + ".mp4";
  video.play();
});
