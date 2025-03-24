window.addEventListener('DOMContentLoaded', function() {
  var spinnerContainer = document.getElementById('spinner-container');

  // 设置一个定时器，在3秒后隐藏加载指示器
  setTimeout(function() {
    spinnerContainer.style.display = 'none';
  }, 2000); // 2500毫秒即2.5秒
});