// service-worker.js - 掘金签到插件的后台服务

import { handleCheckInByMode } from './common-actions.js';

// 安装时的处理
chrome.runtime.onInstalled.addListener(async () => {
  console.log('掘金签到插件已安装');
  try {
    // 检查是否已有签到模式设置，如果没有则设置默认值为手动
    const result = await chrome.storage.sync.get(['checkInMode']);
    if (!result.checkInMode) {
      await chrome.storage.sync.set({ checkInMode: 'manual' });
      console.log('未检测到签到模式设置，已将签到模式设置为手动');
    }
  } catch (error) {
    console.error('检查或设置默认签到模式失败:', error);
  }
});

// 定时检查是否需要签到
if (chrome.alarms) {
  console.log('chrome.alarms : start');
  chrome.alarms.onAlarm.addListener(async (alarm) => {
    if (alarm.name === "dailyCheckIn") {
      console.log('定时检查签到状态触发');
      await handleCheckInByMode();
    }
  });

  // 设置每日签到提醒
  chrome.alarms.create("dailyCheckIn", {
    delayInMinutes: 1, // 首次运行1分钟后触发
    periodInMinutes: 24 * 60 // 每天重复一次
  });
} else {
  console.warn("Alarms API 不可用");
}

// 当扩展程序启动时立即检查
chrome.runtime.onStartup.addListener(async () => {
  console.log("浏览器启动，检查签到状态");
  try {
    await handleCheckInByMode();
  } catch (error) {
    console.error('启动时自动签到失败:', error);
  }
});