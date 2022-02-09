import { google } from "googleapis";

export default async function handler(req, res) {
  const auth = await google.auth.getClient({
    scopes: ["https://www.googleapis.com/auth/spreadsheets.readonly"],
  });
  const sheets = google.sheets({ version: "v4", auth });
  const year = getYearToday();
  const response = await sheets.spreadsheets.values.get({
    spreadsheetId: process.env.SHEET_ID,
    range: `${year}!A2:D365`,
  });

  const devop = getDevopByDay(response);

  if (devop === false) {
    res.status(404).json({message: 'Not found data'});
  }

  res.status(200).json({
    disney: devop[2],
    cnes: devop[3],
  });  
}

function getDevopByDay(response) {
  let devop = response.data.values.find(findDevops);

  if (devop === undefined) {
    devop = false;
  }

  return devop;
}

function getYearToday() {
  const today = new Date();
  return today.getUTCFullYear();
}

function getDayToday() {
  const today = new Date();
  const year = today.getUTCFullYear();
  let month = today.getUTCMonth() + 1;
  let day = today.getUTCDate();

  if (month < 10) {
    month = "0" + month;
  }

  if (day < 10) {
    day = "0" + day;
  }

  return year + "-" + month + "-" + day;
}

function findDevops(element, index, array) {
  const queryToday = getDayToday();

  if (element[0] === queryToday) {
    return true;
  }
  return false;
}
