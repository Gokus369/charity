/**
 * Complete Meal — donation log
 *
 * Paste this into the Google Sheet's Apps Script editor
 * (Extensions ▸ Apps Script), then deploy as a Web App. See the README.
 *
 * It appends one row per submitted donation. It does NOT move money — the
 * donor has already paid by UPI; this is the record you reconcile against
 * the bank statement using the UTR.
 */

/** Rows land in this tab. It is created automatically if missing. */
const SHEET_NAME = 'complete_meal';

/**
 * Leave '' when this script lives INSIDE the sheet (Extensions ▸ Apps Script) —
 * it will use that sheet.
 *
 * If you instead made a standalone project at script.google.com, there is no
 * "active" spreadsheet and nothing can be written. Put the target sheet's ID
 * here: it is the long string in the sheet URL between /d/ and /edit.
 */
const SPREADSHEET_ID = '';

/**
 * Optional shared secret. The Web App URL ends up in the site's JavaScript,
 * so anyone viewing source can find it and post rows. Set this AND send the
 * same value in the payload to reject junk. Leave '' to accept anything.
 */
const TOKEN = '';

function doPost(e) {
  const lock = LockService.getScriptLock();
  try {
    // Two donors submitting at once must not write to the same row.
    lock.waitLock(20000);

    if (!e || !e.postData || !e.postData.contents) {
      return json_({ ok: false, error: 'empty body' });
    }

    const d = JSON.parse(e.postData.contents);

    if (TOKEN && d.token !== TOKEN) {
      return json_({ ok: false, error: 'bad token' });
    }

    const donor = d.donor || {};
    const sh = sheet_();
    sh.appendRow([
      new Date(), // stamped here, not on the donor's device
      String(donor.name || ''),
      String(donor.email || ''),
      Number(d.amount) || 0,
      Number(d.meals) || 0,
      String(d.reference || ''), // UTR
      String(d.method || ''),
      String(d.currency || 'INR'),
      '', // Matched to bank? — filled in by hand during reconciliation
      '', // Receipt sent? — filled in by hand
    ]);

    // Echo where it went, so a silent write to the wrong file is obvious.
    return json_({
      ok: true,
      spreadsheet: sh.getParent().getName(),
      sheet: sh.getName(),
      row: sh.getLastRow(),
    });
  } catch (err) {
    return json_({ ok: false, error: String(err) });
  } finally {
    try {
      lock.releaseLock();
    } catch (ignore) {
      /* lock was never acquired */
    }
  }
}

/**
 * Open the deployed /exec URL in a browser to see exactly which spreadsheet
 * and tab this script writes to, and how many rows are already there.
 */
function doGet() {
  try {
    const sh = sheet_();
    const ss = sh.getParent();
    return json_({
      ok: true,
      service: 'complete-meal donation log',
      spreadsheetName: ss.getName(),
      spreadsheetId: ss.getId(),
      spreadsheetUrl: ss.getUrl(),
      writingToTab: sh.getName(),
      tabsInThisFile: ss.getSheets().map(function (s) {
        return s.getName() + ' (' + s.getLastRow() + ' rows)';
      }),
      rowsSoFar: Math.max(0, sh.getLastRow() - 1), // minus the header
    });
  } catch (err) {
    return json_({ ok: false, error: String(err) });
  }
}

function sheet_() {
  const ss = SPREADSHEET_ID
    ? SpreadsheetApp.openById(SPREADSHEET_ID)
    : SpreadsheetApp.getActiveSpreadsheet();

  if (!ss) {
    throw new Error(
      'No spreadsheet. This script is standalone rather than bound to a sheet — ' +
        'set SPREADSHEET_ID at the top of the file.'
    );
  }

  let sh = ss.getSheetByName(SHEET_NAME) || ss.insertSheet(SHEET_NAME);
  if (sh.getLastRow() === 0) {
    sh.appendRow([
      'Timestamp', 'Name', 'Email', 'Amount', 'Meals',
      'UTR', 'Method', 'Currency', 'Matched to bank?', 'Receipt sent?',
    ]);
    sh.setFrozenRows(1);
    sh.getRange('A1:J1').setFontWeight('bold');
  }
  return sh;
}

function json_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(
    ContentService.MimeType.JSON
  );
}
