// npm install googleapis
import { google } from 'googleapis';

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

    // Load credentials from environment variables
    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: "feedbacksheets@gen-lang-client-0757457961.iam.gserviceaccount.com",
        private_key:`-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQDTYM7bOCWWdHSz\nUJ/tBEnSWbD2edwS5aJPBskbEnSuIjEw3LDxxh11fX/tVA1dREUHvb9hEoKglUd/\n5ZGTT5l1uXWezAZnO+7aZjd2B8cS4mH96H74s4TS+CEZ0cXGimseRp8rzoo5N/SH\nhlSYx4VSo6MFDtDtNUuK2WkX6W3Wl27dTXSPqhL+lTWzKfqvkNBF1sSutEGl+LHv\nAoXHUEVSySJLhi6Ygbuxc4Lr4CrQPfww8slTkdlY57CWD+AXJ1T0IaPSOwzJbn0n\nEXFaQuOykT6qExsEiJ4XgzIeFvboa/PuSaY2w83pRO52hBkLHP4bjHWMsPGCTO8q\npwgcJIP1AgMBAAECggEAAZ+jyqubPBUdPs495gIbXmL6iNPnkgHPbPVp4l3ZbJYY\nwkwLN6vA1vOT4c6Dhqd7MyVpPoVbfPKcJSafw6+Dcmk1b6/CuQ1+veYnpspiK3To\neMeGq3qzTDPEQ/0BOQ91O0lbeGidOUtmWEReQ6V9INbCX/agVk9u/Lim5dVJyL/H\nGd8TCvzlmKmWPfD0+jY0fzCdrSkUDCA+0okG1XtHQtxKEjJ9jxyx48kTxnsHwDff\n+nnvTHFi8mXac0bJwmgjaSL/k9AZxT0al32cR8T1TGzgB2DjYdSc7oU4OHyKs2pO\nTtwPW0a0xFi0IixVESyB4T20ldtG/N5XIGsNAGh3oQKBgQD/H6APnmxJ0bNxG8fV\n/rd5gKIPXPenybyoTXx+I8fjn6JtlkLcsGjF4ThoA6ULS+081QjKYInBxdLvIeMb\nsFLq+x+Fp0e81jvAxYqC86n4r6ih+r8bjGrtWHGSjrQSF7bKtQB6wU1qM5mkibk7\nT+uee3s7V5zXYCQUIqhi+TinkQKBgQDUGrW3S9nXL9cNW00bphrWEzYh5WX8Gt0b\nD8Iwvh5AzJwTP8/5XcFDGGCfU9xNMEFkEI0SyeLMOHZj7VC3Bg8TPM4buJOiODMF\nFZCnWWUYh5S5X7mpKIBqBJQy6E5fJOXlljhrOWvbgO+O3kmvOUa0mMqKwNS5ocfk\n2EUe18GMJQKBgE+mowVdU7e0Vc6xerGQBd5UT8R2JQfojxMIph6Hs0eYtlB6gkN+\nfCeTilXHFYcyXE4KwOTWQQwTZCiursYdRbYBUzUaJeaKCDvGMNlzk5SF2yM/Mt05\n+MRDQaodDZE8gCBHZG/u2+mVVJmvOfqPmCNxr+a2EsyXQoxaybGk15BRAoGBAJES\nZ8Gj/q5hCU0YaogDt40+fKL4fSXO1fZBdAfUsWqOyB2eYshjqOEUVloDiMW+wKsJ\nawQz04zs/YThd3iHi14UE8EAIPIuUC8lDdh4m14Itd+IqrsZeaOJ2DdtjtUirp+2\nfIZSMwRijvd/8JQJr+OsMbRvqdAB6HAMwFIVLkuFAoGBAM0g45NK/E1P0Kf81Q3p\nkIJJHvSLOiTvpIoNsFzUmZpAjWFazGB9HDviMQ8MIxD5LK+tjY02cQ5mXYnsrfUP\nH4GBekrSe7V8WMb841peZpC/4T+Od4txJQsU8AH0MNmr1TaR5sEcLLIHJda/D67T\nFRE31+Gj1b+qEutHt9iSYIdK\n-----END PRIVATE KEY-----\n`,
      },
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });

    const sheets = google.sheets({ version: 'v4', auth });

    const SPREADSHEET_ID = "1uAIE0XaZadPISwF_dtvJbq7YKAezFV_61-H4rwiYLBc"; // Example: '1uAIE0XaZadPISwF_dtvJbq7YKAezFV_61-H4rwiYLBc'

    const response = await sheets.spreadsheets.values.append({
      spreadsheetId: SPREADSHEET_ID,
      range: 'July!A1:B50',
      valueInputOption: 'USER_ENTERED',
      resource: {
        values: [data],
      },
    });

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
