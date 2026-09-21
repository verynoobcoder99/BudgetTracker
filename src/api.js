// ========================================================================
// API — Google Sheets bridge via Apps Script
// Includes mock data mode when no API URL is configured.
// ========================================================================

import { CATEGORIES, getCategoryById, loadSettings, getCurrentMonth, getDaysInMonth } from './utils.js';

// ---------- Mock Data Generator ----------
function generateMockTransactions(month) {
  const [year, m] = month.split('-').map(Number);
  const daysInMonth = getDaysInMonth(month);
  const transactions = [];
  const persons = ['Person 1', 'Person 2'];
  const descriptions = {
    housing: ['Rent', 'Mortgage Payment', 'Home Insurance'],
    groceries: ['Whole Foods', 'Trader Joe\'s', 'Costco', 'Target Groceries', 'Local Market'],
    dining: ['Chipotle', 'Sushi Place', 'Pizza Night', 'Coffee Shop', 'Brunch', 'Thai Takeout'],
    transport: ['Gas', 'Uber', 'Metro Pass', 'Car Wash', 'Parking'],
    utilities: ['Electric Bill', 'Water Bill', 'Internet', 'Gas Bill'],
    entertainment: ['Netflix', 'Movie Tickets', 'Concert', 'Books', 'Game Purchase'],
    shopping: ['Amazon', 'Target', 'New Shoes', 'Home Decor', 'Clothing'],
    health: ['Gym Membership', 'Pharmacy', 'Doctor Visit', 'Supplements'],
    subscriptions: ['Spotify', 'Apple iCloud', 'YouTube Premium', 'News Subscription'],
    personal: ['Haircut', 'Skincare', 'Dry Cleaning'],
    savings: ['Emergency Fund', '401k Extra', 'Investment'],
    misc: ['Gift', 'Donation', 'Miscellaneous'],
  };

  const amounts = {
    housing: [1200, 1500, 1800, 2000],
    groceries: [45, 65, 85, 120, 35, 55],
    dining: [15, 25, 35, 48, 22, 60],
    transport: [40, 55, 12, 25, 8],
    utilities: [80, 120, 65, 95],
    entertainment: [15, 25, 50, 12, 60],
    shopping: [30, 55, 80, 25, 120],
    health: [50, 30, 150, 25],
    subscriptions: [10, 3, 14, 12],
    personal: [35, 45, 15],
    savings: [200, 300, 500],
    misc: [20, 50, 15, 30],
  };

  // Generate 30-60 transactions
  const count = 30 + Math.floor(Math.random() * 30);

  for (let i = 0; i < count; i++) {
    const cat = CATEGORIES[Math.floor(Math.random() * CATEGORIES.length)];
    const descs = descriptions[cat.id] || ['Expense'];
    const amts = amounts[cat.id] || [50];
    const day = Math.min(Math.floor(Math.random() * daysInMonth) + 1, daysInMonth);

    transactions.push({
      row: i + 2,
      date: `${year}-${String(m).padStart(2, '0')}-${String(day).padStart(2, '0')}`,
      person: persons[Math.floor(Math.random() * 2)],
      category: cat.label,
      description: descs[Math.floor(Math.random() * descs.length)],
      amount: amts[Math.floor(Math.random() * amts.length)] + Math.round(Math.random() * 10),
    });
  }

  // Sort by date
  transactions.sort((a, b) => a.date.localeCompare(b.date));
  return transactions;
}

// Cache for mock data so it's consistent during a session
const mockCache = {};

function getMockTransactions(month) {
  if (!mockCache[month]) {
    mockCache[month] = generateMockTransactions(month);
  }
  return mockCache[month];
}

// ---------- API Functions ----------

export async function fetchTransactions(month) {
  const settings = loadSettings();

  if (!settings.apiUrl) {
    // Return mock data
    return getMockTransactions(month);
  }

  try {
    // Add timestamp to prevent aggressive browser caching
    const url = `${settings.apiUrl}?action=getTransactions&month=${month}&t=${Date.now()}`;
    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    return data.transactions || [];
  } catch (err) {
    console.error('Failed to fetch transactions:', err);
    throw err;
  }
}

export async function addTransaction({ date, person, category, description, amount }) {
  const settings = loadSettings();

  if (!settings.apiUrl) {
    // Mock mode — add to mock cache
    const month = date.substring(0, 7);
    const txns = getMockTransactions(month);
    const newTx = {
      row: txns.length + 2,
      date,
      person,
      category,
      description,
      amount: parseFloat(amount),
    };
    txns.push(newTx);
    txns.sort((a, b) => a.date.localeCompare(b.date));
    return { success: true, transaction: newTx };
  }

  try {
    const res = await fetch(settings.apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain' },
      body: JSON.stringify({
        action: 'addTransaction',
        date,
        person,
        category,
        description,
        amount: parseFloat(amount),
      }),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (err) {
    console.error('Failed to add transaction:', err);
    throw err;
  }
}

export async function deleteTransaction(rowIndex, month) {
  const settings = loadSettings();

  if (!settings.apiUrl) {
    // Mock mode
    const txns = getMockTransactions(month);
    const idx = txns.findIndex(t => t.row === rowIndex);
    if (idx !== -1) txns.splice(idx, 1);
    return { success: true };
  }

  try {
    const res = await fetch(settings.apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain' },
      body: JSON.stringify({
        action: 'deleteTransaction',
        row: rowIndex,
      }),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (err) {
    console.error('Failed to delete transaction:', err);
    throw err;
  }
}

// ---------- Summary Computation (client-side from transactions) ----------

export function computeSummary(transactions, settings) {
  const summary = {
    totalSpent: 0,
    byCategory: {},
    byPerson: {},
    byDay: {},
    transactionCount: transactions.length,
  };

  // Initialize categories
  CATEGORIES.forEach(cat => {
    summary.byCategory[cat.label] = {
      spent: 0,
      limit: settings.budgets[cat.id] || 0,
      count: 0,
    };
  });

  // Initialize persons
  summary.byPerson[settings.person1Name] = 0;
  summary.byPerson[settings.person2Name] = 0;

  for (const tx of transactions) {
    const amount = parseFloat(tx.amount) || 0;
    summary.totalSpent += amount;

    // By category
    if (summary.byCategory[tx.category]) {
      summary.byCategory[tx.category].spent += amount;
      summary.byCategory[tx.category].count += 1;
    } else {
      // Fallback to misc
      summary.byCategory['Miscellaneous'].spent += amount;
      summary.byCategory['Miscellaneous'].count += 1;
    }

    // By person
    const personKey = tx.person === settings.person1Name || tx.person === 'Person 1'
      ? settings.person1Name
      : settings.person2Name;
    summary.byPerson[personKey] = (summary.byPerson[personKey] || 0) + amount;

    // By day
    const day = tx.date.split('-')[2];
    summary.byDay[day] = (summary.byDay[day] || 0) + amount;
  }

  return summary;
}
