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