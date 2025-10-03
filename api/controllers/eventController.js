// 导入数据库连接池
const { dbPool } = require('../config/event_db');

/**
 * 1. 获取所有当前/即将举行的活动及类别（首页数据）
 * 逻辑：筛选未结束（event_date >= 当前时间）且有效的活动（is_active = true）
 */
exports.getUpcomingEvents = async (req, res) => {
  try {
    const currentTime = new Date().toISOString().slice(0, 19).replace('T', ' ');
    const query = `
      SELECT e.*, c.category_name, o.organization_name 
      FROM charity_events e
      JOIN event_categories c ON e.category_id = c.category_id
      JOIN charity_organizations o ON e.organization_id = o.organization_id
      WHERE e.event_date >= ? AND e.is_active = true
      ORDER BY e.event_date ASC
    `;
    const [events] = await dbPool.execute(query, [currentTime]);
    res.json(events);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch upcoming events: ' + error.message });
  }
};

/**
 * 2. 获取所有活动类别
 */
exports.getAllCategories = async (req, res) => {
  try {
    const query = 'SELECT * FROM event_categories ORDER BY category_name';
    const [categories] = await dbPool.execute(query);
    res.json(categories);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch categories: ' + error.message });
  }
};

/**
 * 3. 搜索活动（支持按日期、地点、类别筛选，单条件/多条件组合）
 */
exports.searchEvents = async (req, res) => {
  try {
    const { date, location, categoryId } = req.query;
    let query = `
      SELECT e.*, c.category_name, o.organization_name 
      FROM charity_events e
      JOIN event_categories c ON e.category_id = c.category_id
      JOIN charity_organizations o ON e.organization_id = o.organization_id
      WHERE e.is_active = true
    `;
    const params = [];

    // 动态拼接筛选条件
    if (date) {
      query += ' AND DATE(e.event_date) = ?';
      params.push(date);
    }
    if (location) {
      query += ' AND e.event_location LIKE ?';
      params.push(`%${location}%`); // 模糊匹配地点
    }
    if (categoryId) {
      query += ' AND e.category_id = ?';
      params.push(categoryId);
    }

    query += ' ORDER BY e.event_date ASC';
    const [events] = await dbPool.execute(query, params);
    res.json(events);
  } catch (error) {
    res.status(500).json({ error: 'Search failed: ' + error.message });
  }
};

/**
 * 4. 根据ID获取活动详情
 */
exports.getEventById = async (req, res) => {
  try {
    const { eventId } = req.params;
    const query = `
      SELECT e.*, c.category_name, c.category_description,
             o.organization_name, o.mission_statement, o.contact_email
      FROM charity_events e
      JOIN event_categories c ON e.category_id = c.category_id
      JOIN charity_organizations o ON e.organization_id = o.organization_id
      WHERE e.event_id = ? AND e.is_active = true
    `;
    const [events] = await dbPool.execute(query, [eventId]);

    if (events.length === 0) {
      return res.status(404).json({ error: 'Event not found or inactive' });
    }

    // 关键修复：将数值字段从字符串转换为数字
    const event = events[0];
    const eventWithNumbers = {
      ...event,
      ticket_price: Number(event.ticket_price),       // 转换为数字
      fund_target: Number(event.fund_target),         // 转换为数字
      current_fund: Number(event.current_fund)        // 转换为数字
    };

    res.json(eventWithNumbers); // 返回转换后的活动详情
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch event details: ' + error.message });
  }
};