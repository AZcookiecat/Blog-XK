// 面试问题数据
export const interviewQuestions = {
  frontend: [
    {
      id: 1,
      title: '谈谈你对盒模型的理解，以及 box-sizing 属性的作用？',
      answer: '盒模型是 CSS 的基石，它规定了元素如何处理空间和布局。一个独立的盒子由四个部分组成：content (内容)、padding (内边距)、border (边框)、margin (外边距)。  <li>box-sizing 属性用于改变计算元素总宽度和总高度的默认方式。content-box (默认值): 元素的 width 和 height 属性只包含 content 的尺寸。最终元素的总宽度 = width + padding-left + padding-right + border-left + border-right。这种模式下，给元素增加 padding 或 border 会撑大整个盒子，可能导致布局错乱。<li>border-box: 元素的 width 和 height 属性包含了 content、padding 和 border。最终元素的总宽度就是你设置的 width。如果再添加 padding 或 border，浏览器会自动压缩 content 的空间来适应，盒子总尺寸保持不变。在现代前端开发中，通常会通过全局设置 * { box-sizing: border-box; } 来统一盒模型，极大地简化了布局计算。'
    },
    {
      id: 2,
      title: '什么是 BFC (块级格式化上下文)？它有什么作用？如何创建 BFC？',
      answer: 'BFC (Block Formatting Context) 是 Web 页面中一个独立的渲染区域，它规定了内部的块级盒子如何布局，并且这个区域与外部的元素互不影响。 <ul>作用：<li>1. 防止外边距折叠 (Margin Collapse): 当两个相邻的块级元素在垂直方向上相遇时，它们的外边距会发生合并。将其中一个元素包裹在 BFC 中，可以阻止其与外部元素发生外边距折叠。<li>2. 清除浮动: 父元素内部的子元素如果设置了浮动 (float)，会脱离文档流，导致父元素高度塌陷。将父元素设置为 BFC，可以使其重新计算高度，从而包裹住浮动的子元素。<li>3. 防止元素被浮动元素覆盖: 一个块级元素设置为 BFC 后，它不会与浮动元素重叠。常用于实现两栏自适应布局（左边固定宽度浮动，右边自适应）。    <br>创建 BFC 的方法：根元素 <html> 本身就是一个 BFC。float 的值不为 none。position 的值为 absolute 或 fixed。display 的值为 inline-block, table-cell, flex, grid 等。overflow 的值不为 visible（如 hidden, auto, scroll）。'
    }
  ],
  backend: [
  ],
  algorithm: [
  ]
};

// 获取指定类别的面试问题
export const getInterviewQuestionsByCategory = (categoryId) => {
  return interviewQuestions[categoryId] || [];
};