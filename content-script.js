// content-script.js - 在掘金页面上执行签到操作

// 辅助函数：查找包含特定文本的元素
function findElementWithText (tagName, text) {
  try {
    const elements = document.querySelectorAll(tagName);
    for (let element of elements) {
      if (element && element.textContent && element.textContent.trim().includes(text)) {
        return element;
      }
    }
    return null;
  } catch (error) {
    console.error('查找包含文本的元素时出错:', error);
    return null;
  }
}

// 监听来自service worker的消息
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "performCheckIn") {
    console.log("收到签到指令，开始执行签到操作");

    // 使用Promise包装异步签到操作
    const promise = new Promise((resolve, reject) => {
      try {
        const result = performJuejinCheckInWithCallback(resolve);
        // 如果同步执行完成（例如未找到按钮），直接resolve
        if (result !== undefined) {
          resolve(result);
        }
      } catch (error) {
        reject(error);
      }
    });

    // 等待结果并发送响应
    promise.then(result => {
      sendResponse({ success: result });
    }).catch(error => {
      sendResponse({ success: false, error: error.message });
    });

    // 返回true以保持消息通道开放
    return true;
  }
});

// 执行掘金签到的主要函数
function performJuejinCheckInWithCallback (callback) {
  try {
    // 查找签到按钮，通常在掘金页面的右上角区域
    // 根据掘金网站的常见布局，签到按钮可能有以下几种选择器：
    const signInSelectors = [
      'button[data-test-id="signin-button"]',  // 使用数据属性定位
      '.item.signin-btn',                      // 类名选择器
      'button:contains("签到")',               // 包含文本的选择器（需要额外处理）
      '.btn-signin',                           // 另一种类名
      '[aria-label*="签到"]',                  // 使用ARIA标签
      '.top-bar-wrap .signin-btn',             // 特定位置的签到按钮
      '#header .signin-btn',                   // 头部区域的签到按钮
      'div[title="签到"]',                     // 使用标题属性
      '.check-in-btn',                         // 检查in按钮类名
      'text/签到'                              // 文本内容选择器（需要特殊处理）
    ];

    // 尝试找到签到元素
    let signInButton = null;

    // 先尝试一些常见的选择器
    signInButton = document.querySelector('.item.signin-btn') ||
      document.querySelector('.btn-signin') ||
      document.querySelector('#summit-sign') ||
      document.querySelector('.check-in-btn') ||
      document.querySelector('[data-class="signin-btn"]') ||
      document.querySelector('.topbar-btn-signin') ||
      document.querySelector('.sign-container button') ||
      document.querySelector('.gold-home .sign-btn');

    // 如果没有找到，再尝试搜索包含"签到"文本的元素
    if (!signInButton) {
      const signButtons = ['button', 'div', 'span', 'a'];
      for (const tag of signButtons) {
        const element = findElementWithText(tag, '签到');
        if (
          element &&
          !element.textContent.trim().includes('已签到') &&
          !element.classList.contains('signed') &&
          !element.classList.contains('disabled') &&
          !element.hasAttribute('disabled')
        ) {
          signInButton = element;
          break;
        }
      }
    }

    // 再次检查是否有签到相关的类或ID
    if (!signInButton) {
      const potentialElements = [
        ...document.querySelectorAll('[class*="sign"][class*="btn"]'),
        ...document.querySelectorAll('[id*="sign"]'),
        ...document.querySelectorAll('[class*="check-in"]')
      ];

      for (let element of potentialElements) {
        // 确保按钮没有被禁用且不是已签到状态
        if (!element.classList.contains('signed') &&
          !element.classList.contains('disabled') &&
          !element.getAttribute('disabled')) {
          signInButton = element;
          break;
        }
      }
    }

    if (signInButton) {
      console.log("找到签到按钮，准备点击", signInButton);

      // 检查按钮是否可见
      const isVisible = (elem) => {
        const style = window.getComputedStyle(elem);
        return style.display !== 'none' &&
          style.visibility !== 'hidden' &&
          style.opacity !== '0';
      };

      if (!isVisible(signInButton)) {
        console.log("签到按钮不可见，尝试滚动到按钮位置");
        signInButton.scrollIntoView({ behavior: 'smooth', block: 'center' });

        // 等待一会儿让滚动完成
        setTimeout(() => {
          if (isVisible(signInButton)) {
            clickElement(signInButton);
          } else {
            console.log("即使滚动后，签到按钮仍然不可见");
            callback && callback(false); // 使用回调
            return;
          }
        }, 1000);
      } else {
        // 按钮可见，直接点击
        clickElement(signInButton);
      }

      // 等待签到操作的结果
      setTimeout(() => {
        // 检查是否签到成功（按钮文本变化或其他UI变化）
        if (signInButton.textContent && signInButton.textContent.includes('已签到')) {
          console.log("签到成功！");

          callback && callback(true); // 使用回调
          return;
        } else {
          // 尝试再次查找签到按钮，看是否状态改变
          const updatedButton = findElementWithText('button', '签到') ||
            document.querySelector('.item.signin-btn:not(.signed)');

          if (!updatedButton || updatedButton.textContent.includes('已签到')) {
            console.log("签到成功！");

            callback && callback(true); // 使用回调
            return;
          } else {
            console.log("签到可能失败或已完成");
            callback && callback(false); // 使用回调
            return;
          }
        }
      }, 2000);

      return; // 异步操作已经开始

    } else {
      console.log("未找到签到按钮，可能今日已完成签到");
      // 检查是否存在显示已签到状态的元素
      const signedInElements = document.querySelectorAll('*');
      for (let element of signedInElements) {
        if (element.textContent &&
          (element.textContent.includes('已签到') ||
            element.textContent.includes('打卡成功') ||
            element.classList.contains('signed'))) {
          console.log("检测到已签到状态");

          callback && callback(true); // 使用回调
          return;
        }
      }

      // 如果确实找不到签到按钮，可能是因为用户未登录或其他原因
      console.log("无法找到签到按钮，请确认您已登录掘金账号");
      callback && callback(false); // 使用回调
      return;
    }
  } catch (error) {
    console.error("执行签到时出错:", error);
    callback && callback(false); // 使用回调
    return;
  }
}

// 安全地点击元素的辅助函数
function clickElement (element) {
  try {
    // 创建并分发鼠标事件
    const mouseEvent = new MouseEvent('click', {
      view: window,
      bubbles: true,
      cancelable: true,
      button: 0
    });

    element.dispatchEvent(mouseEvent);
    console.log("签到按钮已被点击");
  } catch (error) {
    console.error("点击按钮时出错:", error);

    // 如果原生事件失败，尝试直接调用click方法
    try {
      element.click();
      console.log("使用备用方法点击按钮");
    } catch (fallbackError) {
      console.error("备用点击方法也失败:", fallbackError);
    }
  }
}

// 页面加载完成后初始化
if (document.readyState === 'loading') {
  console.log("掘金签到插件已注入页面 (DOMContentLoaded)");
} else {
  console.log("掘金签到插件已注入页面 (已加载完成)");
}