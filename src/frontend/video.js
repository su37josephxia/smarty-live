/**
 * 根据播放列表循环播放
 * @param {*} list 
 */
function playVideo(list) {
  
  const length = list.length
  if(length === 0 ) return 
  
  // 播放第一个
  let i = 0
  const video = document.getElementById("vid");
  video.src = list[0].path;
  video.play();

  video.addEventListener("ended", function () {
    //    video_Status.src="img/play.png";
    console.log("video end...");
    i++;
    // 重新博凡
    video.src = list[(i % length) ].path;
    video.play();
  });
}

