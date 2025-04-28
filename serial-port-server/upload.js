import { google } from 'googleapis';
import 'dotenv/config'

const auth = new google.auth.GoogleAuth({
    credentials: {
        client_email: process.env.GOOGLE_CLIENT_EMAIL,
        private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'),
    },
    scopes: ['https://www.googleapis.com/auth/drive.file',
        'https://www.googleapis.com/auth/spreadsheets',
    ],
});

const spreadsheetId = process.env.TEMPERATURE_SPREADSHEET_ID;

const authClient = await auth.getClient();
const sheets = google.sheets({
    version: 'v4',
    auth: authClient,
});

const range = 'Sheet1!A:D';

export async function appendData(data) {
    const temperature_f = data['temperature_f'];
    console.log('Appending data to Google Sheets:', temperature_f);

    try {
        // check if temperature_f is defined and has a number value
        if (!temperature_f || isNaN(temperature_f)) {
            console.error('No temperature data found');
            return;
        }

        const response = await sheets.spreadsheets.values.append({
            spreadsheetId,
            range,
            valueInputOption: 'RAW',
            resource: {
                values: [[new Date().toISOString(), temperature_f]]
            }
        });

        console.log('Data appended successfully:', response.data.updates.updatedRange);
    } catch (error) {
        console.error('Error appending data:', error);
    }
}
