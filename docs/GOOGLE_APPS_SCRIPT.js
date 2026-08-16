/**
 * SHREE VELORA EVENT'S - GOOGLE APPS SCRIPT DATABASE & DRIVE WEBHOOK
 * 
 * HOW TO INSTALL IN 2 MINUTES:
 * 1. Open a new Google Sheet at https://sheets.new
 * 2. Create 3 tabs at the bottom named: "Inquiries", "Photos", "Events"
 * 3. In the top menu, click Extensions -> Apps Script
 * 4. Paste this entire code into the editor
 * 5. Click Deploy -> New deployment -> Select type "Web app"
 * 6. Set "Execute as": Me, and "Who has access": Anyone
 * 7. Click Deploy, copy the Web App URL (starts with https://script.google.com/macros/s/...)
 * 8. Add `GOOGLE_SHEETS_WEBHOOK_URL="https://script.google.com/..."` to your Vercel Environment Variables!
 */

function doPost(e) {
  try {
    var contents = JSON.parse(e.postData.contents);
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    
    // Handle Inquiry / Celebration Design Submissions
    if (contents.row || contents.referenceNumber) {
      var sheet = ss.getSheetByName("Inquiries") || ss.insertSheet("Inquiries");
      
      // Add Headers if Sheet is empty
      if (sheet.getLastRow() === 0) {
        sheet.appendRow([
          "Timestamp", "Ref ID", "Full Name", "Phone", "Email", "City",
          "Event Type", "Functions", "Theme", "Venue Preference", "Guests",
          "Budget (INR)", "Services", "Special Requirements", "Status", "Source"
        ]);
        sheet.getRange(1, 1, 1, 16).setFontWeight("bold").setBackground("#EBDCFB");
      }
      
      var r = contents.row || [];
      sheet.appendRow(r.length > 0 ? r : [
        new Date().toISOString(),
        contents.referenceNumber || "SV-2026-" + Math.floor(1000 + Math.random() * 9000),
        contents.fullName || "",
        contents.phone || "",
        contents.email || "",
        contents.city || "",
        contents.eventType || "",
        contents.functions ? contents.functions.join(", ") : "",
        contents.theme || "",
        contents.venuePreference || "",
        contents.guests || "",
        contents.budget || "",
        contents.selectedServices ? contents.selectedServices.join(", ") : "",
        contents.specialRequirements || "",
        "New",
        contents.source || "Website Customizer"
      ]);
      
      // Optional Email Notification to Owner
      try {
        MailApp.sendEmail({
          to: "shreeveloraevents@gmail.com",
          subject: "👑 NEW EVENT INQUIRY: " + (contents.fullName || "Client Inquiry"),
          htmlBody: "<h3>New Event Customizer Lead Received!</h3>" +
                    "<p><b>Name:</b> " + (contents.fullName || "N/A") + "</p>" +
                    "<p><b>Phone:</b> " + (contents.phone || "N/A") + "</p>" +
                    "<p><b>Event Type:</b> " + (contents.eventType || "N/A") + "</p>" +
                    "<p><b>Budget:</b> ₹" + (contents.budget || "N/A") + "</p>" +
                    "<p>Check your Google Sheet for full details!</p>"
        });
      } catch (mailErr) {}

      return ContentService.createTextOutput(JSON.stringify({ ok: true, message: "Inquiry saved to Google Sheet" }))
        .setMimeType(ContentService.MimeType.JSON);
    }

    return ContentService.createTextOutput(JSON.stringify({ ok: true, message: "Received" }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ ok: false, error: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet(e) {
  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var action = e.parameter.action || "all";
    var result = { ok: true };

    if (action === "photos" || action === "all") {
      var photoSheet = ss.getSheetByName("Photos");
      var photos = [];
      if (photoSheet && photoSheet.getLastRow() > 1) {
        var data = photoSheet.getDataRange().getValues();
        for (var i = 1; i < data.length; i++) {
          photos.push({
            id: "ph-" + i,
            title: data[i][0] || "Event Photo",
            category: data[i][1] || "General",
            imageSrc: convertDriveUrl(data[i][2] || ""),
            eventTitle: data[i][3] || "",
            isFeatured: Boolean(data[i][4])
          });
        }
      }
      result.photos = photos;
    }

    return ContentService.createTextOutput(JSON.stringify(result))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ ok: false, error: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function convertDriveUrl(url) {
  if (!url) return "";
  var match = url.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
  if (match && match[1]) return "https://lh3.googleusercontent.com/d/" + match[1];
  var matchId = url.match(/[?&]id=([a-zA-Z0-9_-]+)/);
  if (matchId && matchId[1]) return "https://lh3.googleusercontent.com/d/" + matchId[1];
  return url;
}
