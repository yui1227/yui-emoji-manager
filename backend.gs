const SHEET_ID = '';     // 貼上你的試算表 ID
const FOLDER_ID = '';   // 貼上你的資料夾 ID

// 處理前端抓取資料的請求 (讀取)
function doGet(e) {
  const sheet = SpreadsheetApp.openById(SHEET_ID).getActiveSheet();
  const data = sheet.getDataRange().getValues();
  const emojis = [];

  for (let i = 1; i < data.length; i++) {
    if (data[i][0]) {
      emojis.push({
        id: data[i][0],
        name: data[i][1],
        url: "https://lh3.googleusercontent.com/d/" + data[i][0]
      });
    }
  }

  return ContentService.createTextOutput(JSON.stringify(emojis))
    .setMimeType(ContentService.MimeType.JSON);
}

// 處理前端新增/刪除的請求 (寫入)
function doPost(e) {
  try {
    const payload = JSON.parse(e.postData.contents);
    const action = payload.action;

    if (action === 'add') {
      const folder = DriveApp.getFolderById(FOLDER_ID);
      const decoded = Utilities.base64Decode(payload.base64);
      const blob = Utilities.newBlob(decoded, payload.mimeType, payload.name);
      
      // 在 Google Drive 建立圖片
      const file = folder.createFile(blob);
      
      // 自動設定圖片為「知道連結的人即可檢視」(這樣前端才讀得到圖片)
      file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);

      // 把資料寫入試算表
      const sheet = SpreadsheetApp.openById(SHEET_ID).getActiveSheet();
      sheet.appendRow([file.getId(), payload.name, new Date()]);

      return ContentService.createTextOutput(JSON.stringify({ success: true, id: file.getId() }))
        .setMimeType(ContentService.MimeType.JSON);
    }
    else if (action === 'delete') {
      const fileId = payload.fileId;
      
      // 把檔案丟進垃圾桶
      DriveApp.getFileById(fileId).setTrashed(true);

      // 從試算表中刪除該列
      const sheet = SpreadsheetApp.openById(SHEET_ID).getActiveSheet();
      const data = sheet.getDataRange().getValues();
      for (let i = 1; i < data.length; i++) {
        if (data[i][0] === fileId) {
          sheet.deleteRow(i + 1); // 加上標題行的偏移
          break;
        }
      }
      return ContentService.createTextOutput(JSON.stringify({ success: true }))
        .setMimeType(ContentService.MimeType.JSON);
    }
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({ success: false, error: error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
