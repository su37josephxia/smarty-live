# 视频直播系统
- [x] 自动播放视频列表中功能
- [ ] 个性化背景
- [ ] 配合OBS
- [ ] 自动弹幕播放
- [ ] 于谦大爷回复弹幕
- [ ] 直播数据实时统计

# 配置方法
TODO

# 开发备忘录

## 疑难问题 
1. video自动播放
声音无法自动播放这个在 IOS/Android 上面一直是个惯例，桌面版的 Safari 在 2017 年的 11 版本也宣布禁掉带有声音的多媒体自动播放功能，紧接着在 2018 年 4 月份发布的 Chrome 66 也正式关掉了声音自动播放，也就是说 <audio autopaly> <video autoplay>在桌面版浏览器也将失效。

那么怎么解决呢？解决方式如下：
在chrome 浏览器中输入：chrome://flags，搜索“Autoplay policy”，默认为“Default”，修改为 “No user gesture is required” 就可以了
