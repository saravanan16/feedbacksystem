// // npm install googleapis
// import { google } from 'googleapis';

// export const handler = async (event, context) => {
//   if (event.httpMethod !== 'POST') {
//     return {
//       statusCode: 405,
//       headers: { 'Allow': 'POST' },
//       body: JSON.stringify({ message: 'Method Not Allowed. Please use POST.' }),
//     };
//   }

//   if (!event.body) {
//     return {
//       statusCode: 400,
//       body: JSON.stringify({ message: 'Bad Request: Missing request body.' }),
//     };
//   }

//   try {
//     const requestBody = JSON.parse(event.body);
//     const { data } = requestBody;

//     if (!data || !Array.isArray(data)) {
//       return {
//         statusCode: 400,
//         body: JSON.stringify({ message: 'Invalid request. Body must contain a "data" array.' }),
//       };
//     }

//     // Load credentials from environment variables
//     const auth = new google.auth.GoogleAuth({
//       credentials: {
//         client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
//         private_key: process.env.GOOGLE_PRIVATE_KEY
//       },
//       scopes: ['https://www.googleapis.com/auth/spreadsheets'],
//     });

//     const sheets = google.sheets({ version: 'v4', auth });

//     const SPREADSHEET_ID = process.env.SPREADSHEET_ID; // Example: '1uAIE0XaZadPISwF_dtvJbq7YKAezFV_61-H4rwiYLBc'

//     const response = await sheets.spreadsheets.values.append({
//       spreadsheetId: SPREADSHEET_ID,
//       range: 'July!A1:Z1000',
//       valueInputOption: 'USER_ENTERED',
//       resource: {
//         values: [data],
//       },
//     });

//     return {
//       statusCode: 200,
//       body: JSON.stringify({
//         message: 'Data successfully added to the sheet!',
//         updatedRange: response.data.updates.updatedRange,
//       }),
//     };
//   } catch (error) {
//     console.error('Error with Google Sheets API:', error);
//     return {
//       statusCode: 500,
//       body: JSON.stringify({
//         message: 'An error occurred.',
//         error: error.message,
//       }),
//     };
//   }
// };


import { GoogleAuth } from 'google-auth-library';
import axios from 'axios';

export const handler = async (event, context) => {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers: { 'Allow': 'POST' },
      body: JSON.stringify({ message: 'Method Not Allowed. Please use POST.' }),
    };
  }

  if (!event.body) {
    return {
      statusCode: 400,
      body: JSON.stringify({ message: 'Bad Request: Missing request body.' }),
    };
  }

  try {
    const requestBody = JSON.parse(event.body);
    const { data } = requestBody;

    if (!data || !Array.isArray(data)) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: 'Invalid request. Body must contain a "data" array.' }),
      };
    }

    const auth = new GoogleAuth({
      credentials: {
        client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
        private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'), // Handle newline escaping
      },
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });

    const client = await auth.getClient();
    const accessToken = await client.getAccessToken();

    const SPREADSHEET_ID = process.env.SPREADSHEET_ID;

    const url = `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/July!A1:append?valueInputOption=USER_ENTERED`;

    const response = await axios.post(
      url,
      {
        values: [data],
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken.token}`,
        },
      }
    );

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: 'Data successfully added to the sheet!',
        updatedRange: response.data.updates.updatedRange,
      }),
    };
  } catch (error) {
    console.error('Error with Google Sheets API:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: 'An error occurred.',
        error: error.message,
      }),
    };
  }
};
