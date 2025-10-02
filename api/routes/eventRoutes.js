// 导入依赖和控制器
const express = require('express');
const router = express.Router();
const eventController = require('../controllers/eventController');

// 1. 首页数据接口：获取所有当前/即将举行的活动及类别
router.get('/upcoming', eventController.getUpcomingEvents);

// 2. 活动类别接口：获取所有可用活动类别
router.get('/categories', eventController.getAllCategories);

// 3. 搜索接口：按日期、地点、类别筛选活动
router.get('/search', eventController.searchEvents);

// 4. 活动详情接口：根据ID获取单个活动完整信息
router.get('/:eventId', eventController.getEventById);

module.exports = router;