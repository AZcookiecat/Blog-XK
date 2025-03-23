"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
// NOTE:
// This is the script that will be injected into blogger’s pages and is
// intended to be self-contained, that’s why no imports.
(function () {
    // 主函数，负责查找脚本并初始化表单
    function main() {
        findScripts().forEach((script, index) => {
            if (isInitialized(script)) {
                return;
            }
            const { dataset } = script;
            const { feedId } = dataset;
            if (!feedId) {
                console.error('RES初始化错误：缺少data-feed-id');
                return;
            }
            const { fieldLabelText, fieldLabelClassName, fieldPlaceholder, fieldTextboxClassName, buttonClassName, buttonLabel, } = dataset;
            const uiContainer = createUiContainer();
            const formArea = createFormArea();
            const fieldLabel = createFieldLabel(index, fieldLabelText, fieldLabelClassName);
            const fieldTextbox = createFieldTextbox(index, fieldPlaceholder, fieldTextboxClassName);
            const submitButton = createSubmitButton(buttonClassName, buttonLabel);
            const messageArea = createMessageArea();
            const messageContent = createMessageContent();
            const styleSheet = createStyleSheet();
            const { origin } = new URL(script.src);
            setupFormSending(feedId, submitButton, fieldTextbox, messageContent, new URL(origin));
            formArea.append(fieldLabel, fieldTextbox, submitButton);
            messageArea.append(messageContent);
            uiContainer.append(formArea, messageArea, styleSheet);
            script.insertAdjacentElement('afterend', uiContainer);
            markAsInitialized(script);
        });
    }
    // 检查脚本是否已经初始化
    function isInitialized(script) {
        const { dataAttrName, dataAttrValue } = isInitialized;
        return script.dataset[dataAttrName] === dataAttrValue;
    }
    // 标记脚本为已初始化
    function markAsInitialized(script) {
        const { dataAttrName, dataAttrValue } = isInitialized;
        script.dataset[dataAttrName] = dataAttrValue;
    }
    // 设置表单提交功能
    function setupFormSending(feedId, submitButton, fieldTextbox, messageContent, origin) {
        const submitForm = () => {
            const data = {
                feedId,
                emailAddressText: fieldTextbox.value,
            };
            const displayMessage = (message, type) => {
                messageContent.textContent = message;
                messageContent.setAttribute('type', type);
            };
            const clearField = () => {
                fieldTextbox.value = '';
            };
            preventDoubleClick(submitButton, () => submitEmailToApi(origin, data, displayMessage, clearField));
        };
        const ifKey = (key, handler) => {
            return (event) => {
                if (event.key === key) {
                    handler();
                }
            };
        };
        submitButton.addEventListener('click', submitForm);
        fieldTextbox.addEventListener('keypress', ifKey('Enter', submitForm));
    }
    // 创建 UI 容器元素
    function createUiContainer() {
        return createElement('div', { className: 'res-ui-containter' });
    }
    // 创建表单区域元素
    function createFormArea() {
        return createElement('div', { className: 'res-form-area' });
    }
    // 创建字段标签元素
    function createFieldLabel(index, textContent, className) {
        return createElement('label', {
            htmlFor: fieldId(index),
            textContent: textContent || 'Newsletter邮件订阅:',
            className: className || '',
            style: {
                marginRight: '0.5em',
            },
        });
    }
    // 创建字段输入框元素
    function createFieldTextbox(index, placeholder, className) {
        return createElement('input', {
            id: fieldId(index),
            name: 'email',
            placeholder: placeholder || 'your@email.com',
            style: {
                marginRight: '0.25em',
            },
            className: className || '',
        });
    }
    // 创建提交按钮元素
    function createSubmitButton(className, buttonLabel) {
        return createElement('button', {
            style: {
                margin: '0.25em 0',
            },
            className: className || '',
        }, buttonLabel || '确认');
    }
    // 创建消息区域元素
    function createMessageArea() {
        return createElement('div', { className: 'res-message-area' });
    }
    // 创建消息内容元素
    function createMessageContent() {
        return createElement('p', { className: 'res-message' });
    }
    // 创建样式表元素
    function createStyleSheet() {
        return createElement('style', {}, `
    .res-message:empty {
      display: none;
    }
    .res-message {
      margin: 0;
      padding: .25em .5em;
      border: 1px solid;
      border-radius: .25em;
    }
    .res-message[type="success"] {
      color: #0f5132;
      border-color: #badbcc;
      background-color: #d1e7dd;
    }
    .res-message[type="failure"] {
      color: #842029;
      border-color: #f5c2c7;
      background-color: #f8d7da;
    }
    `);
    }
    // 查找所有需要处理的脚本元素
    function findScripts() {
        return [...document.querySelectorAll('script[res-subscription-form]')];
    }
    // 生成字段的唯一 ID
    function fieldId(index) {
        return `res-email-${index}`;
    }
    // 防止按钮被多次点击
    function preventDoubleClick(button, f) {
        const initialTextContent = button.textContent;
        button.disabled = true;
        button.textContent = 'Wait…';
        f().then(() => {
            setTimeout(() => {
                button.disabled = false;
                button.textContent = initialTextContent;
            }, 500);
        });
    }
    // 创建 DOM 元素，可设置属性和子元素
    function createElement(tagName, props = {}, ...children) {
        const element = document.createElement(tagName);
        for (const propName in props) {
            const propValue = props[propName];
            if (propName === 'style') {
                Object.assign(element.style, propValue);
            }
            else {
                element[propName] = propValue;
            }
        }
        element.append(...children);
        return element;
    }
    // 发送电子邮件到 API 并处理响应
    function submitEmailToApi(origin, data, displayMessage, clearField) {
        return __awaiter(this, void 0, void 0, function* () {
            displayMessage('', 'empty');
            const url = new URL(`/api/subscription`, origin);
            const formData = new URLSearchParams({
                feedId: data.feedId,
                email: data.emailAddressText,
                source: location.href,
            });
            return fetch(url, { method: 'POST', body: formData }).then(handleApiResponse).catch(handleError);
            function handleApiResponse(response) {
                return __awaiter(this, void 0, void 0, function* () {
                    try {
                        const { message, kind } = yield response.json();
                        displayMessage(message, kind === 'Success' ? 'success' : 'failure');
                        if (kind === 'Success') {
                            clearField();
                        }
                    }
                    catch (error) {
                        console.error(error);
                        displayMessage('错误：来自服务器的响应无效！请重试.', 'failure');
                    }
                });
            }
            function handleError(error) {
                let { message } = error;
                if (message === 'Failed to fetch') {
                    message = '无法连接到服务器。请稍后再试一次.';
                }
                displayMessage(`Error: ${message} 😢`, 'failure');
            }
        });
    }
    main();
})();
//# sourceMappingURL=subscription-form.js.map