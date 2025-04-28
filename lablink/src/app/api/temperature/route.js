import { google } from "googleapis";

//TODO: move this to a helper file
const auth = new google.auth.GoogleAuth({
  credentials: {
    client_email: process.env.GOOGLE_CLIENT_EMAIL,
    private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'),
  },
  scopes: [
    'https://www.googleapis.com/auth/drive.file',
    'https://www.googleapis.com/auth/spreadsheets',
  ],
});

const spreadsheetId = process.env.TEMPERATURE_SPREADSHEET_ID;

const authClient = await auth.getClient();
const sheets = google.sheets({
  version: 'v4',
  auth: authClient,
});


export async function GET(req, res) {
  // this will use the serial to get the tempratue
  console.log("Reading temperature");

  const range = 'Sheet1!A:D';
  const response = await sheets.spreadsheets.values.get({
    spreadsheetId,
    range,
  });
  const temperature_f = response.data.values;
  // first row is the header, shift it
  temperature_f.shift();

  // loop and create a json in shape of { temperature_f: 23.4, timestamp: 123456789 }
  const temperatureData = temperature_f.map((row) => {
    const [timestamp, temperature_f] = row;

    return {
      timestamp,
      temperature_f
    };
  });

  return new Response(JSON.stringify(temperatureData), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
    },
  });
}
