// 导入依赖模块
const express = require('express');
const cors = require('cors');
const eventRoutes = require('./routes/eventRoutes');

// 初始化Express应用
const app = express();
const PORT = process.env.PORT || 3000;

// 中间件配置
app.use(cors()); // 允许跨域请求（适配前端页面调用）
app.use(express.json()); // 解析JSON请求体

// 路由注册：所有活动相关API路径前缀为/api/events
app.use('/api/events', eventRoutes);

// 根路径测试接口
app.get('/', (req, res) => {
  res.send('Charity Events API is running. Use /api/events endpoints.');
});

// 启动服务器
app.listen(PORT, () => {
  console.log(`API server running on http://localhost:${PORT}`);
});