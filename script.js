// 密码生成器核心功能
class PasswordGenerator {
    constructor() {
        this.initializeElements();
        this.bindEvents();
        this.loadTheme();
        this.batchPasswords = [];
    }

    // 初始化DOM元素
    initializeElements() {
        // 主要元素
        this.passwordLength = document.getElementById('passwordLength');
        this.lengthValue = document.getElementById('lengthValue');
        this.uppercase = document.getElementById('uppercase');
        this.lowercase = document.getElementById('lowercase');
        this.numbers = document.getElementById('numbers');
        this.symbols = document.getElementById('symbols');
        this.generateBtn = document.getElementById('generateBtn');
        this.passwordOutput = document.getElementById('passwordOutput');
        this.copyBtn = document.getElementById('copyBtn');
        this.strengthText = document.getElementById('strengthText');
        this.strengthFill = document.getElementById('strengthFill');
        
        // 批量生成元素
        this.batchCount = document.getElementById('batchCount');
        this.batchBtn = document.getElementById('batchBtn');
        this.exportBtn = document.getElementById('exportBtn');
        this.batchResults = document.getElementById('batchResults');
        
        // 安全工具元素
        this.randomMin = document.getElementById('randomMin');
        this.randomMax = document.getElementById('randomMax');
        this.randomBtn = document.getElementById('randomBtn');
        this.randomResult = document.getElementById('randomResult');
        this.entropyInput = document.getElementById('entropyInput');
        this.entropyResult = document.getElementById('entropyResult');
        
        // 主题切换
        this.themeToggle = document.getElementById('themeToggle');
        this.themeIcon = this.themeToggle.querySelector('.theme-icon');
        
        // 通知提示
        this.toast = document.getElementById('toast');
    }

    // 绑定事件监听器
    bindEvents() {
        // 密码长度滑块
        this.passwordLength.addEventListener('input', () => {
            this.lengthValue.textContent = this.passwordLength.value;
        });

        // 生成密码按钮
        this.generateBtn.addEventListener('click', () => {
            this.generatePassword();
        });

        // 复制密码按钮
        this.copyBtn.addEventListener('click', () => {
            this.copyPassword();
        });

        // 批量生成按钮
        this.batchBtn.addEventListener('click', () => {
            this.generateBatchPasswords();
        });

        // 导出按钮
        this.exportBtn.addEventListener('click', () => {
            this.exportToCSV();
        });

        // 随机数生成按钮
        this.randomBtn.addEventListener('click', () => {
            this.generateRandomNumber();
        });

        // 密码熵计算输入
        this.entropyInput.addEventListener('input', () => {
            this.calculateEntropy();
        });

        // 主题切换按钮
        this.themeToggle.addEventListener('click', () => {
            this.toggleTheme();
        });

        // 键盘快捷键
        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey || e.metaKey) {
                switch(e.key) {
                    case 'g':
                        e.preventDefault();
                        this.generatePassword();
                        break;
                    case 'c':
                        if (this.passwordOutput.value) {
                            e.preventDefault();
                            this.copyPassword();
                        }
                        break;
                }
            }
        });
    }

    // 生成密码
    generatePassword() {
        const length = parseInt(this.passwordLength.value);
        const useUppercase = this.uppercase.checked;
        const useLowercase = this.lowercase.checked;
        const useNumbers = this.numbers.checked;
        const useSymbols = this.symbols.checked;

        // 验证至少选择一种字符类型
        if (!useUppercase && !useLowercase && !useNumbers && !useSymbols) {
            this.showToast('请至少选择一种字符类型！', 'warning');
            return;
        }

        // 构建字符池
        let charset = '';
        if (useUppercase) charset += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        if (useLowercase) charset += 'abcdefghijklmnopqrstuvwxyz';
        if (useNumbers) charset += '0123456789';
        if (useSymbols) charset += '!@#$%^&*()_+-=[]{}|;:,.<>?';

        // 确保密码包含所有选中的字符类型
        let password = '';
        if (useUppercase) password += this.getRandomChar('ABCDEFGHIJKLMNOPQRSTUVWXYZ');
        if (useLowercase) password += this.getRandomChar('abcdefghijklmnopqrstuvwxyz');
        if (useNumbers) password += this.getRandomChar('0123456789');
        if (useSymbols) password += this.getRandomChar('!@#$%^&*()_+-=[]{}|;:,.<>?');

        // 填充剩余长度
        const remainingLength = length - password.length;
        for (let i = 0; i < remainingLength; i++) {
            password += this.getRandomChar(charset);
        }

        // 打乱密码字符顺序
        password = this.shuffleString(password);

        // 显示密码
        this.passwordOutput.value = password;
        
        // 更新强度指示器
        this.updateStrengthIndicator(password);
        
        // 启用复制按钮
        this.copyBtn.disabled = false;
        
        this.showToast('密码生成成功！', 'success');
    }

    // 获取随机字符
    getRandomChar(charset) {
        const randomIndex = Math.floor(this.getSecureRandom() * charset.length);
        return charset[randomIndex];
    }

    // 获取安全的随机数
    getSecureRandom() {
        if (window.crypto && window.crypto.getRandomValues) {
            const array = new Uint32Array(1);
            window.crypto.getRandomValues(array);
            return array[0] / (0xffffffff + 1);
        }
        // 降级到Math.random（不推荐用于生产环境）
        return Math.random();
    }

    // 打乱字符串
    shuffleString(str) {
        const arr = str.split('');
        for (let i = arr.length - 1; i > 0; i--) {
            const j = Math.floor(this.getSecureRandom() * (i + 1));
            [arr[i], arr[j]] = [arr[j], arr[i]];
        }
        return arr.join('');
    }

    // 更新密码强度指示器
    updateStrengthIndicator(password) {
        const strength = this.calculatePasswordStrength(password);
        
        // 更新强度文本
        this.strengthText.textContent = strength.text;
        
        // 更新强度条
        this.strengthFill.className = 'strength-fill ' + strength.class;
        this.strengthFill.style.width = strength.percentage + '%';
    }

    // 计算密码强度
    calculatePasswordStrength(password) {
        let score = 0;
        let feedback = [];

        // 长度评分
        if (password.length >= 8) score += 1;
        if (password.length >= 12) score += 1;
        if (password.length >= 16) score += 1;
        if (password.length >= 20) score += 1;

        // 字符类型评分
        if (/[a-z]/.test(password)) score += 1;
        if (/[A-Z]/.test(password)) score += 1;
        if (/[0-9]/.test(password)) score += 1;
        if (/[^A-Za-z0-9]/.test(password)) score += 1;

        // 复杂度评分
        if (password.length >= 8 && /[a-z]/.test(password) && /[A-Z]/.test(password) && /[0-9]/.test(password)) {
            score += 2;
        }

        // 避免常见模式
        if (!/(.)\1{2,}/.test(password)) score += 1; // 没有连续重复字符
        if (!/(123|abc|qwe|asd|zxc)/i.test(password)) score += 1; // 没有常见序列

        // 确定强度等级
        if (score <= 3) {
            return { text: '弱', class: 'weak', percentage: 25 };
        } else if (score <= 5) {
            return { text: '中等', class: 'medium', percentage: 50 };
        } else if (score <= 7) {
            return { text: '强', class: 'strong', percentage: 75 };
        } else {
            return { text: '极强', class: 'very-strong', percentage: 100 };
        }
    }

    // 复制密码到剪贴板
    async copyPassword() {
        try {
            await navigator.clipboard.writeText(this.passwordOutput.value);
            this.showToast('密码已复制到剪贴板！', 'success');
        } catch (err) {
            // 降级方案
            this.passwordOutput.select();
            document.execCommand('copy');
            this.showToast('密码已复制到剪贴板！', 'success');
        }
    }

    // 批量生成密码
    generateBatchPasswords() {
        const count = parseInt(this.batchCount.value);
        if (count < 1 || count > 100) {
            this.showToast('生成数量应在1-100之间！', 'warning');
            return;
        }

        this.batchPasswords = [];
        for (let i = 0; i < count; i++) {
            this.generatePassword();
            this.batchPasswords.push(this.passwordOutput.value);
        }

        this.displayBatchResults();
        this.exportBtn.disabled = false;
        this.showToast(`已生成 ${count} 个密码！`, 'success');
    }

    // 显示批量生成结果
    displayBatchResults() {
        this.batchResults.innerHTML = '';
        this.batchPasswords.forEach((password, index) => {
            const passwordDiv = document.createElement('div');
            passwordDiv.className = 'batch-password';
            passwordDiv.textContent = password;
            passwordDiv.title = `密码 ${index + 1}`;
            this.batchResults.appendChild(passwordDiv);
        });
    }

    // 导出为CSV
    exportToCSV() {
        if (this.batchPasswords.length === 0) {
            this.showToast('没有可导出的密码！', 'warning');
            return;
        }

        const csvContent = '序号,密码\n' + 
            this.batchPasswords.map((password, index) => 
                `${index + 1},"${password}"`
            ).join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', `passwords_${new Date().toISOString().slice(0, 10)}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        this.showToast('密码已导出为CSV文件！', 'success');
    }

    // 生成随机数
    generateRandomNumber() {
        const min = parseInt(this.randomMin.value);
        const max = parseInt(this.randomMax.value);
        
        if (isNaN(min) || isNaN(max)) {
            this.showToast('请输入有效的数字范围！', 'warning');
            return;
        }
        
        if (min >= max) {
            this.showToast('最小值必须小于最大值！', 'warning');
            return;
        }

        const randomNum = Math.floor(this.getSecureRandom() * (max - min + 1)) + min;
        this.randomResult.textContent = `随机数: ${randomNum}`;
    }

    // 计算密码熵
    calculateEntropy() {
        const password = this.entropyInput.value;
        if (!password) {
            this.entropyResult.textContent = '请输入密码';
            return;
        }

        // 计算字符集大小
        let charsetSize = 0;
        if (/[a-z]/.test(password)) charsetSize += 26;
        if (/[A-Z]/.test(password)) charsetSize += 26;
        if (/[0-9]/.test(password)) charsetSize += 10;
        if (/[^A-Za-z0-9]/.test(password)) charsetSize += 32; // 常见特殊字符

        if (charsetSize === 0) charsetSize = 1;

        // 计算熵值
        const entropy = Math.log2(Math.pow(charsetSize, password.length));
        
        // 评估熵值强度
        let strength = '';
        if (entropy < 28) strength = ' (弱)';
        else if (entropy < 36) strength = ' (中等)';
        else if (entropy < 50) strength = ' (强)';
        else strength = ' (极强)';

        this.entropyResult.textContent = `熵值: ${entropy.toFixed(2)} 位${strength}`;
    }

    // 主题切换
    toggleTheme() {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        document.documentElement.setAttribute('data-theme', newTheme);
        this.themeIcon.textContent = newTheme === 'dark' ? '☀️' : '🌙';
        
        localStorage.setItem('theme', newTheme);
        this.showToast(`已切换到${newTheme === 'dark' ? '深色' : '浅色'}主题！`, 'success');
    }

    // 加载保存的主题
    loadTheme() {
        const savedTheme = localStorage.getItem('theme') || 'light';
        document.documentElement.setAttribute('data-theme', savedTheme);
        this.themeIcon.textContent = savedTheme === 'dark' ? '☀️' : '🌙';
    }

    // 显示通知提示
    showToast(message, type = 'success') {
        this.toast.textContent = message;
        this.toast.className = `toast ${type}`;
        this.toast.classList.add('show');

        setTimeout(() => {
            this.toast.classList.remove('show');
        }, 3000);
    }
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', () => {
    new PasswordGenerator();
    
    // 添加一些初始密码示例
    const examplePasswords = [
        'MySecurePass123!',
        'Complex#Password$2024',
        'Random@String&456',
        'Strong_Password_789'
    ];
    
    // 在安全建议中添加示例密码
    const securityTips = document.getElementById('securityTips');
    const exampleSection = document.createElement('div');
    exampleSection.innerHTML = `
        <h4>📝 示例密码</h4>
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 0.5rem; margin-top: 1rem;">
            ${examplePasswords.map(pwd => 
                `<div style="background: var(--bg-primary); padding: 0.5rem; border-radius: 4px; font-family: monospace; font-size: 0.8rem; text-align: center; border: 1px solid var(--border-color);">${pwd}</div>`
            ).join('')}
        </div>
    `;
    securityTips.appendChild(exampleSection);
});

// 添加一些额外的工具函数
window.PasswordMaster = {
    // 检查密码是否在常见弱密码列表中
    isCommonPassword: function(password) {
        const commonPasswords = [
            'password', '123456', '123456789', 'qwerty', 'abc123',
            'password123', 'admin', 'letmein', 'welcome', 'monkey'
        ];
        return commonPasswords.includes(password.toLowerCase());
    },

    // 生成记忆友好的密码
    generateMemorablePassword: function() {
        const words = ['apple', 'banana', 'cherry', 'dragon', 'eagle', 'forest', 'garden', 'happy', 'island', 'jungle'];
        const word = words[Math.floor(Math.random() * words.length)];
        const number = Math.floor(Math.random() * 1000);
        const symbol = '!@#$%^&*'[Math.floor(Math.random() * 8)];
        return word.charAt(0).toUpperCase() + word.slice(1) + number + symbol;
    },

    // 生成可发音的密码
    generatePronounceablePassword: function(length = 12) {
        const vowels = 'aeiou';
        const consonants = 'bcdfghjklmnpqrstvwxyz';
        let password = '';
        
        for (let i = 0; i < length; i++) {
            if (i % 2 === 0) {
                password += consonants[Math.floor(Math.random() * consonants.length)];
            } else {
                password += vowels[Math.floor(Math.random() * vowels.length)];
            }
        }
        
        // 添加一些数字和符号
        password = password.charAt(0).toUpperCase() + password.slice(1);
        password += Math.floor(Math.random() * 100);
        password += '!@#$%^&*'[Math.floor(Math.random() * 8)];
        
        return password;
    }
};

// 添加一些键盘快捷键提示
document.addEventListener('DOMContentLoaded', () => {
    const shortcuts = document.createElement('div');
    shortcuts.style.cssText = `
        position: fixed;
        bottom: 20px;
        left: 20px;
        background: var(--bg-secondary);
        border: 1px solid var(--border-color);
        border-radius: var(--radius);
        padding: 1rem;
        font-size: 0.8rem;
        color: var(--text-secondary);
        box-shadow: var(--shadow-md);
        z-index: 1000;
    `;
    shortcuts.innerHTML = `
        <strong>快捷键:</strong><br>
        Ctrl+G: 生成密码<br>
        Ctrl+C: 复制密码
    `;
    document.body.appendChild(shortcuts);
    
    // 5秒后隐藏快捷键提示
    setTimeout(() => {
        shortcuts.style.opacity = '0';
        shortcuts.style.transition = 'opacity 0.5s';
        setTimeout(() => shortcuts.remove(), 500);
    }, 5000);
}); 