// utils.js - 掘金签到插件的公共工具函数

// 关闭标签页的工具函数
export async function closeTab (tabId) {
  try {
    await chrome.tabs.remove(tabId);
    console.log(`标签页已关闭，ID: ${tabId}`);
  } catch (error) {
    console.error(`关闭标签页 ${tabId} 时出错:`, error);
  }
}

// 获取签到模式
export async function getCheckInMode () {
  const result = await chrome.storage.sync.get(['checkInMode']);
  return result.checkInMode || 'manual'; // 作为备用默认值
}

// 检查签到状态
export async function checkSignStatus () {
  const today = new Date();
  const todayStr = `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`;
  const result = await chrome.storage.local.get(['lastCheckInDate']);
  return result.lastCheckInDate === todayStr;
}

// 记录签到时间
export async function recordCheckInTime () {
  const now = new Date();
  const todayStr = `${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()}`;
  await chrome.storage.local.set({ lastCheckInDate: todayStr });
  console.log(`签到记录已保存: ${todayStr}`);
}



// 等待标签页加载完成
export function waitForTabComplete (tabId, timeout = 15000) {
  return new Promise((resolve, reject) => {
    const timeoutId = setTimeout(() => {
      chrome.tabs.onUpdated.removeListener(listener);
      reject(new Error(`等待标签页 ${tabId} 加载超时`));
    }, timeout);

    const listener = (updatedTabId, changeInfo, tab) => {
      if (updatedTabId === tabId && changeInfo.status === 'complete') {
        clearTimeout(timeoutId);
        chrome.tabs.onUpdated.removeListener(listener);
        console.log(`标签页 ${tabId} 加载完成`);
        resolve(tab);
      }
    };

    chrome.tabs.onUpdated.addListener(listener);
  });
}

