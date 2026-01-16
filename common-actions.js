// common-actions.js - 掘金签到插件的公共动作函数

import { JUEJIN_SIGNIN_URL } from './constants.js';
import { closeTab, getCheckInMode, checkSignStatus, recordCheckInTime, waitForTabComplete } from './utils.js';

/**
 * 执行签到的公共函数 - 在 service worker 和 popup 中都可以使用
 */
export async function performCheckIn () {
  let tabId = null;

  try {
    // 创建新的非激活标签页用于签到
    const tab = await chrome.tabs.create({
      url: JUEJIN_SIGNIN_URL,
      active: false  // 设置为非活动状态，即不激活标签页
    });

    tabId = tab.id;
    console.log(`创建签到标签页，ID: ${tabId}`);

    // 等待标签页加载完成
    await waitForTabComplete(tabId);

    // 发送消息给 content script 执行签到
    const result = await chrome.tabs.sendMessage(tabId, { action: "performCheckIn" });

    if (result && result.success) {
      console.log("签到成功");
      await recordCheckInTime();
      return { success: true };
    } else {
      console.warn("签到结果未确认:", result);
      return { success: false, message: result?.message || "签到结果未确认" };
    }
  } catch (error) {
    console.error("执行签到时出错:", error);
    return { success: false, message: error.message };
  } finally {
    // 签到完成后关闭标签页
    if (tabId) {
      await closeTab(tabId);
    }
  }
}

/**
 * 根据签到模式决定是否执行签到的公共函数
 */
export async function handleCheckInByMode () {
  const isSignedInToday = await checkSignStatus();
  const checkInMode = await getCheckInMode();

  if (!isSignedInToday && checkInMode === 'auto') {
    console.log('当前为自动签到模式，执行签到');
    return await performCheckIn();
  } else if (!isSignedInToday && checkInMode === 'manual') {
    console.log('当前为手动签到模式，跳过自动签到');
    return { success: false, message: "手动模式，跳过自动签到" };
  } else if (isSignedInToday) {
    console.log('今日已签到');
    return { success: true, message: "今日已签到" };
  }
}

/**
 * 强制执行签到的公共函数 - 绕过模式校验，主要用于手动签到
 */
export async function forcePerformCheckIn () {
  console.log('强制执行签到，绕过模式校验');
  return await performCheckIn();
}

/**
 * 更新签到状态显示的公共函数
 */
export async function updateStatusDisplay () {
  const isSignedInToday = await checkSignStatus();
  const today = new Date();
  const todayStr = `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`;
  const result = await chrome.storage.local.get(['lastCheckInDate']);
  const lastCheckInDate = result.lastCheckInDate;

  let statusInfo = {};

  if (isSignedInToday) {
    statusInfo = {
      statusText: '今日已签到',
      statusClass: 'status signed',
      buttonText: '已签到',
      buttonDisabled: true,
      lastCheckInText: `最后签到: ${todayStr}`
    };
  } else {
    statusInfo = {
      statusText: '今日未签到',
      statusClass: 'status not-signed',
      buttonText: '手动签到',
      buttonDisabled: false,
      lastCheckInText: lastCheckInDate ? `最后签到: ${lastCheckInDate}` : '尚未签到'
    };
  }

  return statusInfo;
}