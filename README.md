# Password Master - 智能密码生成器

🔐 一个安全、易用、功能强大的在线密码生成工具，帮助您创建高强度、符合各种安全要求的密码。

## ✨ 功能特性

### 🎯 核心功能
- **智能密码生成**：支持自定义长度（8-64位）和字符类型
- **密码强度检测**：实时评估密码强度，提供安全建议
- **批量密码生成**：一次生成多个密码，支持CSV导出
- **安全工具集**：随机数生成器、密码熵计算器等

### 🎨 用户体验
- **响应式设计**：完美适配桌面端和移动端
- **深色/浅色主题**：支持主题切换，保护眼睛
- **键盘快捷键**：Ctrl+G生成密码，Ctrl+C复制密码
- **实时反馈**：操作成功/失败提示，用户体验友好

### 🔒 安全特性
- **客户端生成**：所有密码在本地生成，不上传服务器
- **加密随机数**：使用`crypto.getRandomValues()`生成高质量随机数
- **强度评估**：多维度密码强度检测算法
- **安全建议**：提供专业的密码安全使用建议

## 🚀 快速开始

### 方法1：直接使用
1. 下载项目文件到本地
2. 双击打开 `index.html` 文件
3. 开始使用密码生成器！

### 方法2：本地服务器
```bash
# 使用Python启动本地服务器
python -m http.server 8000

# 或使用Node.js
npx serve .

# 然后在浏览器中访问 http://localhost:8000
```

## 📖 使用说明

### 基础密码生成
1. **设置密码长度**：使用滑块调整密码长度（8-64位）
2. **选择字符类型**：勾选需要的字符类型
   - 大写字母 (A-Z)
   - 小写字母 (a-z)
   - 数字 (0-9)
   - 特殊字符 (!@#$%^&*)
3. **生成密码**：点击"生成密码"按钮
4. **复制密码**：点击复制按钮将密码复制到剪贴板

### 批量密码生成
1. 设置生成数量（1-100个）
2. 点击"批量生成"按钮
3. 查看生成的密码列表
4. 点击"导出CSV"下载密码文件

### 安全工具使用
- **随机数生成器**：输入最小值和最大值，生成随机数
- **密码熵计算**：输入密码，计算熵值评估强度

## 🛠️ 技术架构

### 前端技术
- **HTML5**：语义化标签，无障碍访问
- **CSS3**：现代CSS特性，CSS变量，Grid布局
- **JavaScript ES6+**：类、箭头函数、模板字符串等

### 核心算法
- **密码生成算法**：Fisher-Yates洗牌算法
- **强度评估算法**：多维度评分系统
- **熵值计算**：基于字符集大小的信息熵计算

### 安全实现
```javascript
// 使用加密安全的随机数生成器
getSecureRandom() {
    if (window.crypto && window.crypto.getRandomValues) {
        const array = new Uint32Array(1);
        window.crypto.getRandomValues(array);
        return array[0] / (0xffffffff + 1);
    }
    return Math.random(); // 降级方案
}
```

## 📱 响应式设计

### 断点设置
- **桌面端**：≥1200px，完整功能展示
- **平板端**：768px-1199px，双列布局
- **手机端**：<768px，单列布局，触摸友好

### 移动端优化
- 触摸友好的按钮尺寸
- 适配小屏幕的字体大小
- 优化的表单控件间距

## 🎨 主题系统

### CSS变量架构
```css
:root {
    --bg-primary: #ffffff;
    --bg-secondary: #f8fafc;
    --accent-color: #3b82f6;
    /* 更多变量... */
}

[data-theme="dark"] {
    --bg-primary: #0f172a;
    --bg-secondary: #1e293b;
    --accent-color: #60a5fa;
    /* 深色主题变量... */
}
```

### 主题切换
- 自动保存用户主题偏好
- 平滑的主题切换动画
- 支持系统主题自动检测

## 🔧 自定义配置

### 修改密码字符集
```javascript
// 在script.js中修改字符集
if (useSymbols) charset += '!@#$%^&*()_+-=[]{}|;:,.<>?';
```

### 调整强度评估算法
```javascript
// 修改calculatePasswordStrength函数中的评分规则
if (password.length >= 8) score += 1;
if (password.length >= 12) score += 1;
// 添加更多评分规则...
```

## 📊 性能优化

### 代码优化
- 事件委托减少DOM操作
- 防抖处理避免频繁计算
- 懒加载非关键功能

### 用户体验优化
- 平滑的动画过渡
- 即时的用户反馈
- 智能的错误处理

## 🧪 测试建议

### 功能测试
- [ ] 密码生成功能正常
- [ ] 强度检测准确
- [ ] 批量生成正确
- [ ] 导出功能正常
- [ ] 主题切换正常

### 兼容性测试
- [ ] Chrome 90+
- [ ] Firefox 88+
- [ ] Safari 14+
- [ ] Edge 90+
- [ ] 移动端浏览器

### 安全测试
- [ ] 密码不在网络传输
- [ ] 随机数质量检测
- [ ] XSS防护测试
- [ ] 输入验证测试

## 🚨 注意事项

### 安全提醒
1. **本地生成**：所有密码都在您的设备上生成，不会上传到任何服务器
2. **随机性**：使用加密安全的随机数生成器，确保密码的随机性
3. **强度评估**：强度指示器仅供参考，实际使用时请结合具体场景判断

### 使用建议
1. **定期更换**：建议定期更换重要账户的密码
2. **分类管理**：不同重要程度的账户使用不同强度的密码
3. **安全存储**：生成的密码请妥善保管，不要明文存储

## 🤝 贡献指南

### 如何贡献
1. Fork 本项目
2. 创建功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 创建 Pull Request

### 开发环境
```bash
# 克隆项目
git clone https://github.com/yourusername/password-master.git

# 进入项目目录
cd password-master

# 启动开发服务器
python -m http.server 8000
```

## 📄 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情。

## 🙏 致谢

- 感谢所有为密码安全做出贡献的安全专家
- 感谢开源社区提供的优秀工具和库
- 感谢用户提供的宝贵反馈和建议

## 📞 联系我们

- **项目地址**：https://github.com/yourusername/password-master
- **问题反馈**：https://github.com/yourusername/password-master/issues
- **功能建议**：https://github.com/yourusername/password-master/discussions

---

**🔒 安全提示**：生成的密码仅用于参考，请妥善保管您的实际密码。本工具不会存储任何密码信息，所有操作都在本地完成。

**⭐ 如果这个项目对您有帮助，请给我们一个星标！**

