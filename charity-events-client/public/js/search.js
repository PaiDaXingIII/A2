document.addEventListener('DOMContentLoaded', async () => {
  const filterForm = document.getElementById('filter-form');
  const categorySelect = document.getElementById('category');
  const clearBtn = document.getElementById('clear-btn');
  const resultsContainer = document.getElementById('results-container');
  const errorMessage = document.getElementById('error-message');

  // 1. 加载活动类别到下拉框
  try {
    const categories = await api.getAllCategories();
    categories.forEach(category => {
      const option = document.createElement('option');
      option.value = category.category_id;
      option.textContent = category.category_name;
      categorySelect.appendChild(option);
    });
  } catch (error) {
    errorMessage.textContent = `Failed to load categories: ${error.message}`;
  }

  // 2. 处理搜索表单提交
  filterForm.addEventListener('submit', async (e) => {
    e.preventDefault(); // 阻止默认表单提交

    // 获取筛选参数
    const date = document.getElementById('date').value;
    const location = document.getElementById('location').value;
    const categoryId = document.getElementById('category').value;

    try {
      // 调用搜索API
      const events = await api.searchEvents({ date, location, categoryId });
      renderResults(events);
    } catch (error) {
      errorMessage.textContent = `Search failed: ${error.message}`;
    }
  });

  // 3. 清除筛选按钮逻辑（DOM操作）
  clearBtn.addEventListener('click', () => {
    filterForm.reset(); // 重置表单
    resultsContainer.innerHTML = ''; // 清空结果
    errorMessage.textContent = ''; // 清空错误
  });

  // 4. 渲染搜索结果
  function renderResults(events) {
    if (events.length === 0) {
      resultsContainer.innerHTML = '<p>No events match your criteria.</p>';
      return;
    }

    resultsContainer.innerHTML = ''; // 清空现有结果
    events.forEach(event => {
      const eventCard = document.createElement('div');
      eventCard.className = 'event-card';
      eventCard.innerHTML = `
        <span class="category">${event.category_name}</span>
        <h3>${event.event_name}</h3>
        <p><strong>Date:</strong> ${new Date(event.event_date).toLocaleString()}</p>
        <p><strong>Location:</strong> ${event.event_location}</p>
        <a href="event-detail.html?eventId=${event.event_id}" class="btn">View Details</a>
      `;
      resultsContainer.appendChild(eventCard);
    });
  }
});