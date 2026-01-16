# 🚀 Chrome Web Store 提审检查清单

**扩展名称**: Juejin Daily Companion
**版本**: 1.0.0
**提审日期**: _________
**支持邮箱**: cosimauu@gmail.com

---

## ✅ 提审前检查（逐项打勾）

### 📁 文件准备

- [ ] manifest.json 已更新（包含 author 和 homepage_url）
- [ ] PRIVACY.md 已创建并包含正确的邮箱
- [ ] CHROME_STORE_SUBMISSION.md 已创建
- [ ] README.md 已修改（建议删除"仅供学习"免责声明）
- [ ] 所有图标文件存在（16, 32, 48, 64, 128px）

### 📸 截图准备（至少3张，推荐5张）

尺寸要求: 1280x800 或 640x400

- [ ] 截图1: 扩展弹窗 - 未签到状态（红色背景显示"未签到"）
- [ ] 截图2: 扩展弹窗 - 已签到状态（绿色背景显示"已签到"）
- [ ] 截图3: 模式选择界面（手动/自动模式下拉菜单）
- [ ] 截图4: Chrome工具栏中的扩展图标位置
- [ ] 截图5: 在掘金网站上使用扩展的效果

**截图文件命名建议:**
- `screenshot-1-not-signed.png`
- `screenshot-2-signed.png`
- `screenshot-3-mode-selection.png`
- `screenshot-4-toolbar.png`
- `screenshot-5-juejin-integration.png`

### 📦 打包准备

- [ ] 已执行打包命令:
  ```bash
  zip -r juejin-check-in-v1.0.0.zip . -x "*.git*" -x "*.DS_Store" -x "node_modules/*" -x "*.md"
  ```
- [ ] ZIP文件大小合理（< 20MB）
- [ ] 已在本地测试过ZIP包的加载

### 🌐 GitHub 仓库

- [ ] PRIVACY.md 已推送到 GitHub
- [ ] README.md 已更新
- [ ] 代码已推送到最新版本
- [ ] 确认隐私政策URL可访问: https://github.com/Cosmiumx/juejin-check-in/blob/master/PRIVACY.md

---

## 📝 表单填写内容（直接复制）

### 基本信息

**Item Name (扩展名称):**
```
Juejin Daily Companion
```

**Summary (简短描述 - 132字符以内):**
```
A personal productivity tool that helps you stay organized with your daily activities on Juejin developer community.
```

**Detailed Description (详细描述):**
```
见 CHROME_STORE_SUBMISSION.md 的"详细描述"部分，完整复制
```

**Category (分类):**
```
Primary: Productivity
Secondary: Social & Communication
```

---

### 🔐 权限理由（每个权限单独一个框）

#### Permission 1: tabs
```
Required to check if user is currently on juejin.cn website to display relevant check-in status in the extension popup. Does not access browsing history or data from other websites.
```

#### Permission 2: storage
```
Required to save user's check-in status and preferences (manual/auto mode setting) locally on the device. No data is transmitted to external servers.
```

#### Permission 3: activeTab
```
Required to interact with the current Juejin page only when user explicitly clicks the extension icon. Used to display check-in button and status. Only accesses the active tab upon user action.
```

#### Permission 4: alarms ⚠️
```
Required to schedule daily reminders to notify users about check-in availability. Used solely for reminder notifications, not for automated actions. Users maintain full control over when to perform check-ins.
```

#### Permission 5: host_permissions (https://juejin.cn/user/*) ⚠️
```
Required to access only the Juejin user center pages where check-in functionality is located. Extension only operates on the /user/* path within juejin.cn domain and does not access homepage or other sections. Minimal scope needed for core functionality.
```

---

### 📋 额外说明（Additional Information）

```
This extension enhances user productivity on Juejin platform. The background service worker only checks user's check-in status and provides notifications - it does NOT perform automated actions without user's prior authorization.

All actual check-in operations require:
1. User to be logged in to their Juejin account
2. User's explicit consent (by enabling the feature)
3. User's active session and authentication

The extension respects user privacy and Juejin's terms of service. This is a legitimate productivity enhancement tool, similar to calendar reminders or task management applications.

Key Technical Points:
• No data is sent to external servers
• All data storage is local only
• Open source code available for review
• Complies with Manifest V3 standards
• Users can disable automation at any time

The extension does not:
• Collect personal information
• Track browsing behavior
• Access data from other websites
• Violate any platform terms of service
```

---

### 🌐 网站和联系信息

**Official Website:**
```
https://github.com/Cosmiumx/juejin-check-in
```

**Support Email:**
```
cosimauu@gmail.com
```

**Privacy Policy URL:**
```
https://github.com/Cosmiumx/juejin-check-in/blob/master/PRIVACY.md
```

---

### 🧪 审核员测试说明（Notes for Reviewers）

```
TEST INSTRUCTIONS

If you need to test the extension functionality, please follow these steps:

1. Install the extension
2. Visit https://juejin.cn
3. You can create a free Juejin account at https://juejin.cn/login
4. After logging in, click the extension icon in the toolbar
5. You will see the check-in status dashboard
6. Click "手动签到" (Manual Check-in) button to test the functionality
7. The status will update to show "已签到" (Checked In) with green background

ALTERNATIVE: You may use any existing Juejin account for testing. The extension does not require any special account permissions.

The extension is designed to work with user's own Juejin accounts and respects all authentication requirements of the Juejin platform.
```

---

## 🎯 提交步骤

### Step 1: 访问开发者控制台
访问: https://chrome.google.com/webstore/devconsole

### Step 2: 创建新项目
- [ ] 点击 "New Item"
- [ ] 上传 `juejin-check-in-v1.0.0.zip`
- [ ] 等待上传完成（约1-2分钟）

### Step 3: 填写商店详情
- [ ] 复制粘贴上面的所有内容到对应表单
- [ ] 上传5张截图
- [ ] 确认所有必填项已填写

### Step 4: 填写权限理由
⚠️ **最关键的步骤**
- [ ] tabs - 已填写
- [ ] storage - 已填写
- [ ] activeTab - 已填写
- [ ] alarms - 已填写
- [ ] host_permissions - 已填写

### Step 5: 最终检查
- [ ] 预览商店页面效果
- [ ] 检查截图顺序和清晰度
- [ ] 确认邮箱地址正确: cosimauu@gmail.com
- [ ] 确认隐私政策链接可访问

### Step 6: 提交审核
- [ ] 点击 "Submit for Review"
- [ ] 确认提交成功
- [ ] 记录提交时间: _________

---

## ⏰ 后续跟进

### 预期时间线
- **初次审核**: 3-7 个工作日
- **可能需要**: 多次提交（2-3次正常）

### 审核结果

#### ✅ 如果通过
- [ ] 发布扩展
- [ ] 更新README添加Chrome Web Store链接
- [ ] 庆祝！🎉

#### ❌ 如果被拒
- [ ] 仔细阅读拒绝理由
- [ ] 查看 CHROME_STORE_SUBMISSION.md 中的"申诉模板"
- [ ] 根据理由修改或申诉
- [ ] 记录拒绝原因: _________________

---

## 📊 审核策略

**当前策略**: 激进版本（保留所有功能）
**预计通过率**: 40-50%

### 常见拒绝理由及应对

| 拒绝理由 | 应对策略 |
|---------|---------|
| Automated interaction with third-party website | 使用申诉模板，强调用户控制 |
| Unclear purpose | 修改描述，更清晰说明 |
| Excessive permissions | 缩小 host_permissions 范围 |

### Plan B: 保守版本

如果被拒且申诉失败：
- [ ] 删除 service-worker.js 的自动签到功能
- [ ] 更新权限理由为"仅提醒，不自动化"
- [ ] 重新提交

---

## 📞 联系信息

**开发者邮箱**: cosimauu@gmail.com
**GitHub**: https://github.com/Cosmiumx/juejin-check-in
**Chrome Web Store Dashboard**: https://chrome.google.com/webstore/devconsole

---

## 💡 温馨提示

1. **保持邮箱畅通** - 谷歌会通过邮件通知审核结果
2. **耐心等待** - 审核需要时间，不要频繁查询
3. **准备申诉** - 即使被拒也很正常，可以申诉
4. **保持积极** - 多次提交直到通过是常见的

---

**祝提审顺利！🚀**

---

**清单版本**: v1.0
**最后更新**: 2026-01-16
**维护者**: Cosmium (cosimauu@gmail.com)
