// 页面加载完成后执行
document.addEventListener('DOMContentLoaded', async () => {
  const eventsContainer = document.getElementById('events-container');
  const errorMessage = document.getElementById('error-message');

  try {
    // 调用API获取即将举行的活动（复用api.js中的封装）
    const events = await api.getUpcomingEvents();

    if (events.length === 0) {
      eventsContainer.innerHTML = '<p>No upcoming events found.</p>';
      return;
    }

    // 动态生成活动卡片
    events.forEach(event => {
      // 判断活动状态（已结束/即将举行）
      const eventDate = new Date(event.event_date);
      const now = new Date();
      const status = eventDate > now ? 'Upcoming' : 'Current';

      const eventCard = document.createElement('div');
      eventCard.className = 'event-card';
      eventCard.innerHTML = `
        <span class="category">${event.category_name} | ${status}</span>
        <h3>${event.event_name}</h3>
        <p><strong>Date:</strong> ${new Date(event.event_date).toLocaleString()}</p>
        <p><strong>Location:</strong> ${event.event_location}</p>
        <a href="event-detail.html?eventId=${event.event_id}" class="btn">View Details</a>
      `;
      eventsContainer.appendChild(eventCard);
    });

  } catch (error) {
    // 显示错误信息（DOM操作）
    errorMessage.textContent = `Failed to load events: ${error.message}`;
  }
});