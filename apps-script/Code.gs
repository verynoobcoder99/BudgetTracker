// ========================================================================
// GOOGLE APPS SCRIPT — Budget Tracker API Bridge
// ========================================================================
//
// SETUP INSTRUCTIONS:
// 1. Create a new Google Sheet
// 2. Rename the first tab to "Transactions"
// 3. Add headers in row 1: Date | Person | Category | Description | Amount
// 4. Go to Extensions → Apps Script
// 5. Delete everything in Code.gs and paste this entire file
// 6. Click Deploy → New Deployment
// 7. Select "Web App" as the type
// 8. Set "Execute as" to "Me"
// 9. Set "Who has access" to "Anyone"
// 10. Click Deploy and copy the Web App URL
// 11. Paste the URL in your dashboard's Settings page
// 12. Share the Google Sheet with your partner (Editor access)
//
// That's it! Both of you can now enter data via the dashboard
// or directly in the Google Sheet.
// ========================================================================

const SHEET_NAME = 'Transactions';

// ---------- Web App Entry Points ----------

function doGet(e) {
  const action = e.parameter.action;
  let result;

  try {
    switch (action) {
      case 'getTransactions':
        result = getTransactions(e.parameter.month);
        break;
      case 'getBudgets':
        result = getBudgets();
        break;
      case 'getSummary':
        result = getSummary(e.parameter.month);
        break;
      default:
        result = { error: 'Unknown action: ' + action };
    }
  } catch (err) {
    result = { error: err.message };
  }

  return ContentService.createTextOutput(JSON.stringify(result))
    .setMimeType(ContentService.MimeType.JSON);
}

function doPost(e) {
  let body;
  try {
    body = JSON.parse(e.postData.contents);
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ error: 'Invalid JSON' }))
      .setMimeType(ContentService.MimeType.JSON);
  }

  let result;

  try {
    switch (body.action) {
      case 'addTransaction':
        result = addTransaction(body);
        break;
      case 'deleteTransaction':
        result = deleteTransaction(body.row);
        break;
      case 'setBudget':
        result = setBudget(body.category, body.limit);
        break;
      default:
        result = { error: 'Unknown action: ' + body.action };
    }
  } catch (err) {
    result = { error: err.message };
  }

  return ContentService.createTextOutput(JSON.stringify(result))
    .setMimeType(ContentService.MimeType.JSON);
}

// ---------- Transaction Functions ----------

function getTransactions(month) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME);
  if (!sheet) return { transactions: [] };

  const data = sheet.getDataRange().getValues();
  const headers = data[0];
  const transactions = [];

  for (let i = 1; i < data.length; i++) {
    const row = data[i];
    const date = formatDateValue(row[0]);

    // Filter by month if provided (format: YYYY-MM)
    if (month && date.substring(0, 7) !== month) continue;

    transactions.push({
      row: i + 1, // 1-indexed row number in the sheet
      date: date,
      person: row[1] || '',
      category: row[2] || '',
      description: row[3] || '',
      amount: parseFloat(row[4]) || 0,
    });
  }

  return { transactions: transactions };
}

function addTransaction(data) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME);
  if (!sheet) {
    // Create the sheet if it doesn't exist
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const newSheet = ss.insertSheet(SHEET_NAME);
    newSheet.appendRow(['Date', 'Person', 'Category', 'Description', 'Amount']);
    newSheet.getRange(1, 1, 1, 5).setFontWeight('bold');
    return addTransaction(data); // Retry
  }

  sheet.appendRow([
    data.date,
    data.person,
    data.category,
    data.description,
    parseFloat(data.amount) || 0,
  ]);

  // Format the new row
  const lastRow = sheet.getLastRow();
  sheet.getRange(lastRow, 5).setNumberFormat('$#,##0.00');

  return {
    success: true,
    row: lastRow,
    transaction: {
      row: lastRow,
      date: data.date,
      person: data.person,
      category: data.category,
      description: data.description,
      amount: parseFloat(data.amount) || 0,
    },
  };
}

function deleteTransaction(rowNumber) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME);
  if (!sheet) return { error: 'Sheet not found' };

  if (rowNumber < 2 || rowNumber > sheet.getLastRow()) {
    return { error: 'Invalid row number' };
  }

  sheet.deleteRow(rowNumber);
  return { success: true };
}

// ---------- Budget Functions ----------

function getBudgets() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Budget Limits');
  if (!sheet) return { budgets: {} };

  const data = sheet.getDataRange().getValues();
  const budgets = {};

  for (let i = 1; i < data.length; i++) {
    budgets[data[i][0]] = parseFloat(data[i][1]) || 0;
  }

  return { budgets: budgets };
}

function setBudget(category, limit) {
  let sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Budget Limits');
  if (!sheet) {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    sheet = ss.insertSheet('Budget Limits');
    sheet.appendRow(['Category', 'Monthly Limit']);
    sheet.getRange(1, 1, 1, 2).setFontWeight('bold');
  }

  const data = sheet.getDataRange().getValues();
  let found = false;

  for (let i = 1; i < data.length; i++) {
    if (data[i][0] === category) {
      sheet.getRange(i + 1, 2).setValue(parseFloat(limit) || 0);
      found = true;
      break;
    }
  }

  if (!found) {
    sheet.appendRow([category, parseFloat(limit) || 0]);
  }

  return { success: true };
}

// ---------- Summary Function ----------

function getSummary(month) {
  const txResult = getTransactions(month);
  const transactions = txResult.transactions;

  const summary = {
    totalSpent: 0,
    byCategory: {},
    byPerson: {},
    transactionCount: transactions.length,
  };

  for (const tx of transactions) {
    summary.totalSpent += tx.amount;

    if (!summary.byCategory[tx.category]) {
      summary.byCategory[tx.category] = { spent: 0, count: 0 };
    }
    summary.byCategory[tx.category].spent += tx.amount;
    summary.byCategory[tx.category].count += 1;

    if (!summary.byPerson[tx.person]) {
      summary.byPerson[tx.person] = 0;
    }
    summary.byPerson[tx.person] += tx.amount;
  }

  return summary;
}

// ---------- Helpers ----------

function formatDateValue(value) {
  // First, check if it's a native Date object
  if (value instanceof Date) {
    return _format(value);
  }
  
  // If it's a string, try parsing it
  if (typeof value === 'string') {
    // Check for MM/DD/YYYY
    const parts = value.split('/');
    if (parts.length === 3) {
      return `${parts[2]}-${parts[0].padStart(2, '0')}-${parts[1].padStart(2, '0')}`;
    }
    
    // Try passing it to new Date() (handles "Mon Sep 21 2026 00:00:00 GMT-0400")
    const d = new Date(value);
    if (!isNaN(d.getTime())) {
      return _format(d);
    }
    
    return value;
  }
  
  return String(value);
}

function _format(d) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}
