// ========================================================================
// CHARTS — Chart.js configuration and helpers
// ========================================================================

import { CATEGORIES, getCategoryByLabel, formatCurrency } from './utils.js';

// Consistent color palette
const CHART_COLORS = CATEGORIES.map(c => c.color);
const CHART_COLORS_ALPHA = CATEGORIES.map(c => c.color + '33');

// Chart.js global defaults
if (window.Chart) {
  Chart.defaults.color = '#94a3b8';
  Chart.defaults.font.family = "'Inter', sans-serif";
  Chart.defaults.font.size = 12;
  Chart.defaults.plugins.legend.labels.usePointStyle = true;
  Chart.defaults.plugins.legend.labels.pointStyle = 'circle';
  Chart.defaults.plugins.legend.labels.padding = 16;
  Chart.defaults.animation.duration = 800;
  Chart.defaults.animation.easing = 'easeOutQuart';
}

// ---------- Category Doughnut Chart ----------
export function createCategoryChart(ctx, summaryByCategory) {
  const labels = [];
  const data = [];
  const colors = [];

  for (const cat of CATEGORIES) {
    const catData = summaryByCategory[cat.label];
    if (catData && catData.spent > 0) {
      labels.push(cat.label);
      data.push(catData.spent);
      colors.push(cat.color);
    }
  }

  return new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels,
      datasets: [{
        data,
        backgroundColor: colors,
        borderColor: 'rgba(10, 14, 26, 0.8)',
        borderWidth: 3,
        hoverBorderWidth: 0,
        hoverOffset: 8,
      }],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      cutout: '65%',
      plugins: {
        legend: {
          position: 'bottom',
          labels: {
            padding: 12,
            font: { size: 11, weight: '500' },
          },
        },
        tooltip: {
          backgroundColor: 'rgba(17, 24, 39, 0.95)',
          borderColor: 'rgba(255,255,255,0.1)',
          borderWidth: 1,
          cornerRadius: 8,
          padding: 12,
          titleFont: { weight: '600' },
          callbacks: {
            label: (ctx) => {
              const total = ctx.dataset.data.reduce((a, b) => a + b, 0);
              const pct = ((ctx.parsed / total) * 100).toFixed(1);
              return ` ${ctx.label}: ${formatCurrency(ctx.parsed)} (${pct}%)`;
            },
          },
        },
      },
    },
  });
}

// ---------- Person Comparison Bar Chart ----------
export function createPersonChart(ctx, byPerson) {
  const labels = Object.keys(byPerson);
  const data = Object.values(byPerson);

  return new Chart(ctx, {
    type: 'bar',
    data: {
      labels,
      datasets: [{
        data,
        backgroundColor: ['rgba(129, 140, 248, 0.7)', 'rgba(244, 114, 182, 0.7)'],
        borderColor: ['#818cf8', '#f472b6'],
        borderWidth: 2,
        borderRadius: 8,
        barPercentage: 0.5,
      }],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      indexAxis: 'y',
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: 'rgba(17, 24, 39, 0.95)',
          borderColor: 'rgba(255,255,255,0.1)',
          borderWidth: 1,
          cornerRadius: 8,
          padding: 12,
          callbacks: {
            label: (ctx) => ` ${formatCurrency(ctx.parsed.x)}`,
          },
        },
      },
      scales: {
        x: {
          grid: { color: 'rgba(255,255,255,0.04)', drawBorder: false },
          ticks: {
            callback: (val) => formatCurrency(val),
            font: { size: 11 },
          },
        },
        y: {
          grid: { display: false },
          ticks: { font: { size: 13, weight: '600' } },
        },
      },
    },
  });
}

// ---------- Daily Spending Line Chart ----------
export function createDailyChart(ctx, byDay, daysInMonth) {
  const labels = [];
  const data = [];

  for (let d = 1; d <= daysInMonth; d++) {
    const dayStr = String(d).padStart(2, '0');
    labels.push(d);
    data.push(byDay[dayStr] || 0);
  }

  return new Chart(ctx, {
    type: 'line',
    data: {
      labels,
      datasets: [{
        label: 'Daily Spending',
        data,
        borderColor: '#818cf8',
        backgroundColor: 'rgba(129, 140, 248, 0.08)',
        borderWidth: 2.5,
        fill: true,
        tension: 0.4,
        pointRadius: 0,
        pointHitRadius: 20,
        pointHoverRadius: 5,
        pointHoverBackgroundColor: '#818cf8',
        pointHoverBorderColor: '#fff',
        pointHoverBorderWidth: 2,
      }],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: 'rgba(17, 24, 39, 0.95)',
          borderColor: 'rgba(255,255,255,0.1)',
          borderWidth: 1,
          cornerRadius: 8,
          padding: 12,
          callbacks: {
            title: (items) => `Day ${items[0].label}`,
            label: (ctx) => ` Spent: ${formatCurrency(ctx.parsed.y)}`,
          },
        },
      },
      scales: {
        x: {
          grid: { color: 'rgba(255,255,255,0.03)', drawBorder: false },
          ticks: {
            font: { size: 10 },
            maxTicksLimit: 15,
          },
        },
        y: {
          grid: { color: 'rgba(255,255,255,0.04)', drawBorder: false },
          ticks: {
            callback: (val) => '$' + val,
            font: { size: 11 },
          },
          beginAtZero: true,
        },
      },
    },
  });
}

// ---------- Month-over-Month Comparison Chart ----------
export function createComparisonChart(ctx, currentByCategory, prevByCategory) {
  const labels = [];
  const currentData = [];
  const prevData = [];

  for (const cat of CATEGORIES) {
    const curr = currentByCategory[cat.label]?.spent || 0;
    const prev = prevByCategory[cat.label]?.spent || 0;
    if (curr > 0 || prev > 0) {
      labels.push(cat.label);
      currentData.push(curr);
      prevData.push(prev);
    }
  }

  return new Chart(ctx, {
    type: 'bar',
    data: {
      labels,
      datasets: [
        {
          label: 'This Month',
          data: currentData,
          backgroundColor: 'rgba(129, 140, 248, 0.7)',
          borderColor: '#818cf8',
          borderWidth: 1.5,
          borderRadius: 6,
        },
        {
          label: 'Last Month',
          data: prevData,
          backgroundColor: 'rgba(255, 255, 255, 0.08)',
          borderColor: 'rgba(255, 255, 255, 0.2)',
          borderWidth: 1.5,
          borderRadius: 6,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'top',
          labels: { font: { size: 11, weight: '500' }, padding: 16 },
        },
        tooltip: {
          backgroundColor: 'rgba(17, 24, 39, 0.95)',
          borderColor: 'rgba(255,255,255,0.1)',
          borderWidth: 1,
          cornerRadius: 8,
          padding: 12,
          callbacks: {
            label: (ctx) => ` ${ctx.dataset.label}: ${formatCurrency(ctx.parsed.y)}`,
          },
        },
      },
      scales: {
        x: {
          grid: { display: false },
          ticks: {
            font: { size: 10 },
            maxRotation: 45,
          },
        },
        y: {
          grid: { color: 'rgba(255,255,255,0.04)', drawBorder: false },
          ticks: {
            callback: (val) => '$' + val,
            font: { size: 11 },
          },
          beginAtZero: true,
        },
      },
    },
  });
}
