// popup.js - 弹窗界面的交互逻辑

import { JUEJIN_SIGNIN_URL } from './constants.js';
import { closeTab } from './utils.js';

document.addEventListener('DOMContentLoaded', async () => {
  const statusDiv = document.getElementById('status');
  const lastCheckInDiv = document.getElementById('lastCheckIn');
  const checkInBtn = document.getElementById('checkInBtn');
  const openJuejinBtn = document.getElementById('openJuejinBtn');

  // 检查今天的签到状态
  async function checkTodayStatus () {
    const today = new Date();
    const todayStr = `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`;

    const result = await chrome.storage.local.get(['lastCheckInDate']);
    const lastCheckInDate = result.lastCheckInDate;

    if (lastCheckInDate === todayStr) {
      statusDiv.textContent = '今日已签到';
      statusDiv.className = 'status signed';
      lastCheckInDiv.textContent = `最后签到: ${formatDate(new Date())}`;
      checkInBtn.disabled = true;
      checkInBtn.textContent = '已签到';
    } else {
      statusDiv.textContent = '今日未签到';
      statusDiv.className = 'status not-signed';
      lastCheckInDiv.textContent = lastCheckInDate ? `最后签到: ${lastCheckInDate}` : '尚未签到';
      checkInBtn.disabled = false;
      checkInBtn.textContent = '手动签到';
    }
  }

  // 格式化日期显示
  function formatDate (date) {
    return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
  }

  // 手动签到按钮点击事件
  checkInBtn.addEventListener('click', async () => {
    checkInBtn.disabled = true;
    checkInBtn.textContent = '签到中...';
    statusDiv.textContent = '正在签到...';

    try {
      // 创建新的非激活标签页用于签到
      const juejinTab = await chrome.tabs.create({
        url: JUEJIN_SIGNIN_URL,
        active: false  // 设置为非激活状态
      });

      console.log(`创建签到标签页，ID: ${juejinTab.id}`);

      // 等待页面加载并发送签到消息
      setTimeout(async () => {
        try {
          const result = await chrome.tabs.sendMessage(juejinTab.id, { action: "performCheckIn" });

          // 签到完成后关闭标签页
          // setTimeout(() => {
          //   closeTab(juejinTab.id);
          // }, 2000);

          if (result && result.success) {
            statusDiv.textContent = '签到成功！';
            statusDiv.className = 'status signed';
            checkInBtn.textContent = '已签到';
            // 更新最后签到时间显示
            const today = new Date();
            const todayStr = `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`;
            lastCheckInDiv.textContent = `最后签到: ${todayStr}`;

            // 更新本地存储中的签到时间
            await chrome.storage.local.set({ lastCheckInDate: todayStr });
          } else {
            statusDiv.textContent = '签到失败或已完成';
            statusDiv.className = 'status not-signed';
            checkInBtn.disabled = false;
            checkInBtn.textContent = '重试';
          }
        } catch (error) {
          console.error('签到过程中出错:', error);
          statusDiv.textContent = '签到失败，请稍后重试';
          statusDiv.className = 'status not-signed';
          checkInBtn.disabled = false;
          checkInBtn.textContent = '重试';
        }
      }, 2000);
    } catch (error) {
      console.error('签到过程中出错:', error);
      statusDiv.textContent = '签到失败，请稍后重试';
      statusDiv.className = 'status not-signed';
      checkInBtn.disabled = false;
      checkInBtn.textContent = '重试';
    }
  });

  // 打开掘金按钮点击事件
  openJuejinBtn.addEventListener('click', async () => {
    try {
      // 尝试找到现有的掘金标签页
      const tabs = await chrome.tabs.query({ url: "https://juejin.cn/*" });

      if (tabs.length > 0) {
        // 如果存在，激活该标签页
        await chrome.tabs.update(tabs[0].id, { active: true });
      } else {
        // 否则创建新的标签页
        await chrome.tabs.create({ url: JUEJIN_SIGNIN_URL });
      }

      // 关闭弹窗
      window.close();
    } catch (error) {
      console.error('打开掘金页面时出错:', error);
    }
  });

  // 初始化状态
  await checkTodayStatus();
});