# 问题

## 1. 如何在响应数据库中的数据的变化？通过websocket吗？

- 待办事项需要有已读和未读

> 待处理
>
### 1. 通过websocket将信息推送过来，不需要定时读取服务器的信息，否则服务器承载的访问量过大时容易导致服务器网络卡顿或崩溃，可以留一个按钮可以手动同步服务器信息。

> - [x] 已经加入WebSocket并连接成功
>
> - [x] 可以手动同步服务器信息
>
> - [x] 增、删、改待办事项
>
> - [ ] 查询要怎么处理？分页、无限加载还是？  无限加载
>
> 想要采用时间线处理
>
> - [ ] [了解定时规则根据时间生成定时器表达式](http://tools.jb51.net/code/Quartz_Cron_create)
 
### 2. 信息推送到本地后增加未读消息，将当前待办加入定时器队列，等到了时间的时候，弹出一个对话框进行提醒用户。

> - [ ] 待处理

### 3. 用户也可以设置提前通知信息。

> - [x] 已处理

## 2. 如何在一个页面弹出另一个窗口？用于提示待办事项

> - [x] 已处理

## 3. 待办到了定好的时间时，如何出现通知待办提醒？

> - [ ] 待处理
>
> [通知 Windows](https://www.electronjs.org/docs/tutorial/notifications)

## 4. 如何更新版本？

> - [ ] 待处理
>
> [更新应用程序](https://www.electronjs.org/docs/tutorial/updates)
>
> [autoUpdater](https://www.electronjs.org/docs/api/auto-updater)

## 5. 借鉴TOAST UI中的chart、editor、calendar、imager-editor等之类的UI。

> - [ ] 待处理
>
> - [ ] 待办事项编辑的时候有些按钮未能加载上此处仍需处理
>
> - [ ] 将下方的日历功能加载上
>
> [TOAST UI](https://ui.toast.com/)

插件|用途
---|---
chart | 图表
editor | markdown编辑器
calendar | 日历上可以添加并且编辑待办事项
imager-editor | 图片修改

## 6. 图标颜色
> #BFCBD9

# 参考

## 0. UI界面及功能模仿[Meister Task]

## 1. [用Node.js实现定时任务](https://cloud.tencent.com/developer/article/1558283)

> 1. 使用shell操作命令备份数据库
>
> 2. 发送电子邮件

# 相关指南

-|插件
---|---
路由 | [Vue Router]
定时器 | [cron] 、[核心：cron.js]、[表达式]
系统对话框 | [使用 Electron 调用系统对话框]
Electron API 演示(中文版) | [Electron API 演示(中文版)]
系统通知 | [node-notifier]、[push.js]

[Vue Router]: https://router.vuejs.org/zh/
[cron]: https://github.com/kelektiv/node-cron
[核心：cron.js]: https://github.com/kelektiv/node-cron/blob/master/lib/cron.js
[表达式]: http://tools.jb51.net/code/Quartz_Cron_create
[node-notifier]: https://github.com/mikaelbr/node-notifier
[push.js]: https://github.com/Nickersoft/push.js
[使用 Electron 调用系统对话框]: https://segmentfault.com/a/1190000008530168
[Electron API 演示(中文版)]: https://github.com/demopark/electron-api-demos-Zh_CN
[Meister Task]: https://www.meistertask.com/app/dashboard
