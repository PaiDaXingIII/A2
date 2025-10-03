document.addEventListener('DOMContentLoaded', async () => {
  const eventDetailContainer = document.getElementById('event-detail');
  const errorMessage = document.getElementById('error-message');
  const modal = document.getElementById('register-modal');
  const closeBtn = document.querySelector('.close-btn');

  // 1. 从URL获取eventId（通过查询字符串）
  const urlParams = new URLSearchParams(window.location.search);
  const eventId = urlParams.get('eventId');

  if (!eventId) {
    errorMessage.textContent = 'No event ID provided.';
    return;
  }

  // 2. 调用API获取活动详情
  try {
    const event = await api.getEventById(eventId);
    renderEventDetail(event);
  } catch (error) {
    errorMessage.textContent = `Failed to load event details: ${error.message}`;
  }

  // 3. 渲染活动详情
  function renderEventDetail(event) {
    // 计算筹款进度百分比
    const progressPercentage = (event.current_fund / event.fund_target) * 100;

    eventDetailContainer.innerHTML = `
      <h1>${event.event_name}</h1>
      <span class="category">${event.category_name}</span>

      <div class="event-meta">
        <p><strong>Date & Time:</strong> ${new Date(event.event_date).toLocaleString()}</p>
        <p><strong>Location:</strong> ${event.event_location}</p>
        <p><strong>Ticket Price:</strong> $${event.ticket_price.toFixed(2)}</p>
        <p><strong>Organized by:</strong> ${event.organization_name}</p>
      </div>

      <div class="event-description">
        <h3>About This Event</h3>
        <p>${event.event_description}</p>
      </div>

      <div class="fundraising">
        <h3>Fundraising Progress</h3>
        <p>Target: $${event.fund_target.toFixed(2)} | Raised: $${event.current_fund.toFixed(2)}</p>
        <div class="fund-progress">
          <div class="progress-bar" style="width: ${progressPercentage}%"></div>
        </div>
      </div>

      <button id="register-btn" class="btn">Register for Event</button>
    `;

    // 绑定注册按钮事件（触发模态框）
    document.getElementById('register-btn').addEventListener('click', () => {
      modal.style.display = 'block';
    });
  }

  // 4. 关闭模态框
  closeBtn.addEventListener('click', () => {
    modal.style.display = 'none';
  });

  // 点击模态框外部关闭
  window.addEventListener('click', (e) => {
    if (e.target === modal) {
      modal.style.display = 'none';
    }
  });
});