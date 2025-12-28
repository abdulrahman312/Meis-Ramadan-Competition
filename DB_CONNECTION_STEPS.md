# Connecting Google Sheets to the Ramadan Quiz App

To make this app functional, you need a "Backend" to handle the database logic. We use Google Apps Script for this as it is free and connects natively to Google Sheets.

## Phase 1: Prepare the Google Sheet

1. Create a new Google Sheet.
2. Rename the Spreadsheet to **"Ramadan Quiz DB"**.
3. Create **3 Sheets (Tabs)** inside it with the exact names and columns below:

### Tab 1: "Status"
*   **Cell A1:** `Day 1` (Or `Day 2`, `NA`, etc. This controls which question is active).

### Tab 2: "Question DB"
*   **Note:** The tab name must be exactly **"Question DB"** (with the space).
*   **Row 1 (Headers):** `Day`, `Question`, `Option 1`, `Option 2`, `Option 3`, `Correct Option`
*   **Data Example:**
    *   A2: `Day 1`
    *   B2: `أي شهر فرض الصيام على المسلمين؟`
    *   C2: `شعبان`
    *   D2: `رمضان`
    *   E2: `محرم`
    *   F2: `Option 2` (Must be "Option 1", "Option 2", or "Option 3").

### Tab 3: "App DB"
*   **Row 1 (Headers):** `ID`, `Name`, `Role`, `Day 1`, `Day 2`, `Day 3` ... (Add columns up to Day 30).
*   **Data Example:**
    *   A2: `1010101010`
    *   B2: `Ahmed Ali`
    *   C2: `Student`
    *   D2... (Leave empty, the app will fill these with 1 or 0).

---

## Phase 2: The Google Apps Script Code

1. In your Google Sheet, go to **Extensions** > **Apps Script**.
2. Delete everything in `Code.gs`.
3. Copy and paste the **EXACT** code below:

```javascript
/* 
  RAMADAN QUIZ APP BACKEND - FIXED FOR "Question DB" TAB
*/

function doGet(e) {
  return handleRequest(e);
}

function doPost(e) {
  return handleRequest(e);
}

function handleRequest(e) {
  const lock = LockService.getScriptLock();
  lock.tryLock(30000); 

  try {
    const action = e.parameter.action || (e.postData && JSON.parse(e.postData.contents).action);
    
    if (action === 'getStatus') return getStatus();
    if (action === 'verifyUser') return verifyUser(e);
    if (action === 'getQuestion') return getQuestion(e);
    if (action === 'checkSubmission') return checkSubmission(e);
    if (action === 'submitAnswer') return submitAnswer(e);
    
    return response({ error: "Invalid Action" });
    
  } catch (error) {
    return response({ error: error.toString() });
  } finally {
    lock.releaseLock();
  }
}

// --- CONTROLLERS ---

function getStatus() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Status');
  const status = String(sheet.getRange('A1').getValue()).trim();
  return response({ status: status });
}

function verifyUser(e) {
  const id = String(e.parameter.id).trim();
  const role = e.parameter.role;
  
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('App DB');
  const data = sheet.getDataRange().getValues();
  const headers = data[0];
  
  let user = null;
  
  for (let i = 1; i < data.length; i++) {
    const row = data[i];
    const rowId = String(row[0]).trim();
    const rowRole = row[2];
    
    let isMatch = false;
    
    if (rowRole === role) {
      if (rowId === id) {
        isMatch = true;
      } else if (role === 'Parent' && rowId.endsWith(id.slice(-9))) {
        isMatch = true;
      }
    }
    
    if (isMatch) {
      const dayRecords = {};
      for (let c = 3; c < headers.length; c++) {
        if (String(headers[c]).startsWith('Day')) {
          const score = row[c];
          if (score !== "" && score !== null) {
            dayRecords[headers[c]] = Number(score);
          }
        }
      }
      user = {
        id: rowId,
        name: row[1],
        role: rowRole,
        dayRecords: dayRecords
      };
      break; 
    }
  }
  
  return response({ user: user });
}

function getQuestion(e) {
  // Robust trimming to ensure "Day 1 " matches "Day 1"
  const day = String(e.parameter.day).trim().toLowerCase();
  
  // FIXED: Targeting 'Question DB' to match your screenshot
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Question DB');
  
  if (!sheet) {
    return response({ error: "Question DB sheet not found" });
  }

  const data = sheet.getDataRange().getValues();
  
  let question = null;
  
  for (let i = 1; i < data.length; i++) {
    const rowDay = String(data[i][0]).trim().toLowerCase();
    
    if (rowDay === day) {
      // Map columns based on user screenshot:
      // Col 0: Day
      // Col 1: Question
      // Col 2,3,4: Options (Columns C, D, E)
      // Col 5: Correct Option (Column F)

      const options = [data[i][2], data[i][3], data[i][4]].filter(o => o !== "" && o !== undefined);
      
      // Parse "Option 2" -> index 1
      const correctRaw = String(data[i][5]); 
      let correctIndex = 0;
      
      // Extract number from string (e.g., "Option 2" -> 2)
      const match = correctRaw.match(/\d+/);
      if (match) {
        correctIndex = parseInt(match[0]) - 1; // Convert 1-based to 0-based
      }

      // Safety fallback
      if (correctIndex < 0 || correctIndex >= options.length) correctIndex = 0;

      question = {
        day: data[i][0], // Use original casing from sheet
        text: data[i][1],
        options: options,
        correctOptionIndex: correctIndex
      };
      break;
    }
  }
  
  return response({ question: question });
}

function checkSubmission(e) {
  const userId = String(e.parameter.userId).trim();
  const day = String(e.parameter.day).trim();
  
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('App DB');
  const data = sheet.getDataRange().getValues();
  const headers = data[0];
  
  const dayColIndex = headers.indexOf(day);
  
  if (dayColIndex === -1) return response({ isAlreadySubmitted: false });
  
  for (let i = 1; i < data.length; i++) {
    if (String(data[i][0]).trim() === userId) {
      const cellValue = data[i][dayColIndex];
      const isSubmitted = (cellValue !== "" && cellValue !== null);
      return response({ isAlreadySubmitted: isSubmitted });
    }
  }
  
  return response({ isAlreadySubmitted: false });
}

function submitAnswer(e) {
  const payload = JSON.parse(e.postData.contents);
  const userId = String(payload.userId).trim();
  const day = String(payload.day).trim();
  const isCorrect = payload.isCorrect;
  
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('App DB');
  const data = sheet.getDataRange().getValues();
  const headers = data[0];
  
  const dayColIndex = headers.indexOf(day);
  if (dayColIndex === -1) return response({ status: 'error', message: 'Day column not found' });
  
  for (let i = 1; i < data.length; i++) {
    if (String(data[i][0]).trim() === userId) {
      // Sheet rows are 1-indexed, loop is 0-indexed relative to data. 
      // i is index in data array. Row in sheet is i + 1.
      sheet.getRange(i + 1, dayColIndex + 1).setValue(isCorrect ? 1 : 0);
      return response({ status: 'success' });
    }
  }
  
  return response({ status: 'error', message: 'User not found' });
}

function response(data) {
  return ContentService.createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}
```

## Phase 3: Update Deployment (CRITICAL)

Because you changed the backend code, you **must update the deployment**:

1. Click **Deploy** > **Manage Deployments**.
2. Click the **Pencil Icon** (Edit) at the top.
3. **Version**: Select **"New version"** from the dropdown.
4. Click **Deploy**.
5. Your existing URL will remain valid, but now it will use the fixed code.
