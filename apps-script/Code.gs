/**
 * Complete Meal — donation log
 *
 * Paste this into Extensions ▸ Apps Script on the Google Sheet that should
 * receive donations, then deploy it as a Web App (see README).
 *
 * It appends one row per submitted donation. It does NOT move money — the
 * donor has already paid by UPI; this is the record you reconcile against
 * the bank statement using the UTR.
 */

const SHEET_NAME = 'complete_meal';

/**
 * Optional shared secret. The Web App URL ends up in the site's JavaScript,
 * so anyone who views source can find it and post rows. Setting a token here
 * AND in the site's .env (VITE_SHEET_TOKEN) means junk rows get rejected.
 * Leave '' to accept anything.
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
    sheet_().appendRow([
      new Date(), // stamped here, not on the donor's device
      String(donor.name || ''),
      String(donor.email || ''),
      Number(d.amount) || 0,
      Number(d.meals) || 0,
      String(d.reference || ''), // UTR
      String(d.method || ''),
      String(d.currency || 'INR'),
      '', // Matched to bank? — fill in by hand during reconciliation
      '', // Receipt sent? — fill in by hand
    ]);

    return json_({ ok: true });
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

/** Lets you open the deployed URL in a browser to confirm it is live. */
function doGet() {
  return json_({ ok: true, service: 'complete-meal donation log' });
}

function sheet_() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
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
