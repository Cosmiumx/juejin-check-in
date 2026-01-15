// service-worker.js - 掘金自动签到插件的后台服务

import { JUEJIN_SIGNIN_URL } from './constants.js';
import { closeTab } from './utils.js';

// 安装时的处理
chrome.runtime.onInstalled.addListener(() => {
  console.log('掘金自动签到插件已安装');
});

// 检查签到状态的函数
async function checkSignStatus () {
  const today = new Date();
  const todayStr = `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`;

  const result = await chrome.storage.local.get(['lastCheckInDate']);
  return result.lastCheckInDate === todayStr;
}

// 记录签到时间
async function recordCheckInTime () {
  const now = new Date();
  const todayStr = `${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()}`;

  await chrome.storage.local.set({ lastCheckInDate: todayStr });
  console.log(`签到记录已保存: ${todayStr}`);
}

// 执行签到的函数
async function performCheckIn () {
  try {
    // 创建新的非激活标签页用于签到
    const tab = await chrome.tabs.create({
      url: JUEJIN_SIGNIN_URL,
      active: true // 设置为非活动状态，即不激活标签页
    });

    console.log(`创建签到标签页，ID: ${tab.id}`);

    // 等待一段时间让页面加载
    await new Promise(resolve => setTimeout(resolve, 3000));

    // 发送消息给content script执行签到
    const result = await chrome.tabs.sendMessage(tab.id, { action: "performCheckIn" });

    if (result && result.success) {
      console.log("签到成功");
      await recordCheckInTime();

      // 签到完成后关闭标签页
      // setTimeout(() => {
      //   closeTab(tab.id);
      // }, 2000); // 延迟2秒关闭，确保签到结果被记录
    }
  } catch (error) {
    console.error("执行签到时出错:", error);

    // 如果出现错误，尝试关闭标签页
    try {
      // 这里我们不知道tab的id，如果有错误发生，可能需要其他方式清理
      console.log("签到过程中发生错误，但无法确定标签页ID以进行清理");
    } catch (cleanupError) {
      console.error("清理标签页时出错:", cleanupError);
    }
  }
}

// 监听来自content script的消息
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "checkInResult") {
    if (message.success) {
      recordCheckInTime();
      console.log("通过content script收到签到成功消息");
    }
    sendResponse({ success: true });
  }
  // 注意：如果使用了异步操作，需要返回true以保持消息通道开放
  if (message.action === "performCheckInRequest") {
    console.log('performCheckInRequest :', message);
    (async () => {
      const isSignedInToday = await checkSignStatus();
      if (!isSignedInToday) {
        await performCheckIn();
      }
      sendResponse({ success: true });
    })();
    return true; // 保持消息通道开放
  }
});

// 定时检查是否需要签到（可选）
if (chrome.alarms) {
  console.log('chrome.alarms : start');
  chrome.alarms.onAlarm.addListener(async (alarm) => {
    if (alarm.name === "dailyCheckIn") {
      console.log('dailyCheckIn :', alarm);
      const isSignedInToday = await checkSignStatus();
      if (!isSignedInToday) {
        console.log("开始自动签到流程");
        await performCheckIn();
      }
    }
  });

  // 设置每日自动签到提醒
  chrome.alarms.create("dailyCheckIn", {
    delayInMinutes: 1, // 1分钟后首次运行
    periodInMinutes: 24 * 60 // 每天重复一次
  });
} else {
  console.warn("Alarms API 不可用");
}

// 当扩展程序启动时立即检查
chrome.runtime.onStartup.addListener(async () => {
  console.log("浏览器启动，检查签到状态");
  const isSignedInToday = await checkSignStatus();
  if (!isSignedInToday) {
    // 延迟执行，等待网络连接稳定
    setTimeout(async () => {
      await performCheckIn();
    }, 5000);
  }
});