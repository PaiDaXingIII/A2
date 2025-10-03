// API基础URL（与后端API服务器地址对应）
const API_BASE_URL = 'http://localhost:3000/api/events';

// 封装API请求方法（使用Promise和fetch）
const api = {
  // 获取即将举行的活动（首页）
  getUpcomingEvents: async () => {
    const response = await fetch(`${API_BASE_URL}/upcoming`);
    if (!response.ok) {
      throw new Error('Failed to fetch upcoming events');
    }
    return response.json();
  },

  // 获取所有活动类别（搜索页筛选）
  getAllCategories: async () => {
    const response = await fetch(`${API_BASE_URL}/categories`);
    if (!response.ok) {
      throw new Error('Failed to fetch categories');
    }
    return response.json();
  },

  // 搜索活动（支持多条件）
  searchEvents: async (filters) => {
    // 构建查询字符串（如?date=2025-10-15&location=Sydney）
    const params = new URLSearchParams();
    if (filters.date) params.append('date', filters.date);
    if (filters.location) params.append('location', filters.location);
    if (filters.categoryId) params.append('categoryId', filters.categoryId);

    const response = await fetch(`${API_BASE_URL}/search?${params.toString()}`);
    if (!response.ok) {
      throw new Error('Search request failed');
    }
    return response.json();
  },

  // 获取单个活动详情
  getEventById: async (eventId) => {
    const response = await fetch(`${API_BASE_URL}/${eventId}`);
    if (!response.ok) {
      if (response.status === 404) {
        throw new Error('Event not found or inactive');
      }
      throw new Error('Failed to fetch event details');
    }
    return response.json();
  }
};