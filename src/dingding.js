#!/usr/bin/env zx
$.verbose = false;

//B站用户ID
const spaceId = "175301983";
//直播间ID
const liveId = "21877310";

//钉钉群机器人webhook
const dingBotUrl =
  "https://oapi.dingtalk.com/robot/send?access_token=d081485fa9069f97e7a0d414f4dca6d5cf9a27bd3991bdc3b3a3b8012f696b09";

const dingBotKey = "直播间有人留言";

const dataFile = "./.bilibili/data";

await fs.ensureFile(dataFile);

var localData = readDataFile();

// 1. 获取粉丝的数量
requestFollowerCount();
// 2. 获取直播间的弹幕
requestLiveRoomChats();

async function requestFollowerCount() {
  const res = await fetch(
    "https://api.bilibili.com/x/relation/stat?vmid=" + spaceId
  );
  const data = await res.json();
  console.log("粉丝数:" + data.data.follower);
}

async function requestLiveRoomChats() {
  function needToUpdate(room) {
    if (room.length <= 0) return false;

    let last = getLastMessage(room);
    if (last.timeline == localData.lasttimeline) return false;

    // 如果是自己发的话，那么不需要更新
    if (last.uid == spaceId) return false;

    return true;
  }

  async function fetchRoomData() {
    let res = await fetch(
      "https://api.live.bilibili.com/xlive/web-room/v1/dM/gethistory?roomid=" +
        liveId
    );
    let data = await res.json();
    return data.data.room;
  }

  async function noticeDingBot(room) {
    let last = getLastMessage(room);
    const body = JSON.stringify({
      text: {
        content: `${dingBotKey}: ${last.text} \n 进入直播间：https://live.bilibili.com/${liveId}`,
      },
      msgtype: "text",
    });

    await fetch(dingBotUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body,
    });
  }

  function getLastMessage(room) {
    return room[room.length - 1];
  }

  const room = await fetchRoomData();
  if (!needToUpdate(room)) return;
  saveData("lasttimeline", getLastMessage(room).timeline);
  await noticeDingBot(room);
}

function saveData(key, str) {
  localData[key] = str;

  fs.writeFile(
    dataFile,
    JSON.stringify(localData),
    { flag: "w" },
    function (err) {
      if (err) {
        throw err;
      }
    }
  );
}

function readDataFile() {
  let data;
  try {
    data = JSON.parse(fs.readFileSync(dataFile, "utf-8"));
  } catch (err) {
    data = {};
  }
  return data;
}
