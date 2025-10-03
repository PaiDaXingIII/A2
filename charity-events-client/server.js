// 导入express模块
const express = require('express');
const app = express();
const PORT = 3001;  // 与API服务器端口（3000）区分，避免冲突

// 托管public目录为静态资源
app.use(express.static('public'));

// 启动服务器
app.listen(PORT, () => {
  console.log(`Client server running on http://localhost:${PORT}`);
});