// popup.js - 弹窗界面的交互逻辑

import { JUEJIN_SIGNIN_URL } from './constants.js';
import { checkSignStatus, getCheckInMode } from './utils.js';
import { updateStatusDisplay, forcePerformCheckIn } from './common-actions.js';

document.addEventListener('DOMContentLoaded', async () => {
  const statusDiv = document.getElementById('status');
  const lastCheckInDiv = document.getElementById('lastCheckIn');
  const checkInBtn = document.getElementById('checkInBtn');
  const openJuejinBtn = document.getElementById('openJuejinBtn');
  const checkInModeSelect = document.getElementById('checkInMode');

  // 加载签到模式设置
  async function loadCheckInMode () {
    const mode = await getCheckInMode();
    checkInModeSelect.value = mode || 'manual'; // 如果没有设置过，则默认为手动
    currentMode = mode || 'manual'; // 初始化当前模式
  }

  // 保存签到模式设置
  async function saveCheckInMode (mode) {
    await chrome.storage.sync.set({ checkInMode: mode });
    console.log(`签到模式已设置为: ${mode}`);
  }

  // 监听签到模式选择变化
  let currentMode = 'manual'; // 追踪当前模式

  checkInModeSelect.addEventListener('change', async (event) => {
    const selectedMode = event.target.value;
    const prevMode = currentMode; // 使用追踪的当前模式作为之前的模式

    // 保存新的签到模式
    await saveCheckInMode(selectedMode);

    // 更新当前模式
    currentMode = selectedMode;

    // 如果是从手动切换到自动，且今天还没有签到，则执行一次签到
    if (prevMode === 'manual' && selectedMode === 'auto') {
      const isSignedInToday = await checkSignStatus();
      if (!isSignedInToday) {
        // 执行一次签到
        await triggerManualCheckIn();
      }
    }
  });

  // 触发手动签到的函数
  async function triggerManualCheckIn () {
    checkInBtn.textContent = '签到中...';
    statusDiv.textContent = '正在签到...';
    statusDiv.className = 'status checking';

    // 强制执行签到，绕过模式校验
    const result = await forcePerformCheckIn();

    if (result && result.success) {
      // 签到成功后更新状态
      await updateStatusDisplayFromCommon();
    } else {
      statusDiv.textContent = '签到失败或已完成';
      statusDiv.className = 'status not-signed';
      checkInBtn.disabled = false;
      checkInBtn.textContent = '重试';
    }
  }

  // 从公共模块获取状态显示的函数
  async function updateStatusDisplayFromCommon () {
    const statusInfo = await updateStatusDisplay();

    statusDiv.textContent = statusInfo.statusText;
    statusDiv.className = statusInfo.statusClass;
    checkInBtn.textContent = statusInfo.buttonText;
    checkInBtn.disabled = statusInfo.buttonDisabled;
    lastCheckInDiv.textContent = statusInfo.lastCheckInText;
  }

  // 检查今天的签到状态
  async function checkTodayStatus () {
    await updateStatusDisplayFromCommon();
  }

  // 手动签到按钮点击事件
  checkInBtn.addEventListener('click', async () => {
    await triggerManualCheckIn();
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
  await loadCheckInMode();
  await checkTodayStatus();
});