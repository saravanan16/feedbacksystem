// netlify/functions/handler.js
import { SignJWT } from 'jose';

// Required: Node 18+ for global fetch
export const handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers: { Allow: 'POST' },
      body: JSON.stringify({ message: 'Only POST requests allowed' }),
    };
  }

  if (!event.body) {
    return {
      statusCode: 400,
      body: JSON.stringify({ message: 'Missing request body' }),
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

    // === STEP 1: Generate Access Token using JWT ===
    const SERVICE_ACCOUNT_EMAIL = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
    const PRIVATE_KEY = process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n');

    const iat = Math.floor(Date.now() / 1000);
    const exp = iat + 3600;

    const jwt = await new SignJWT({
      iss: SERVICE_ACCOUNT_EMAIL,
      scope: 'https://www.googleapis.com/auth/spreadsheets',
      aud: 'https://oauth2.googleapis.com/token',
      iat,
      exp,
    })
      .setProtectedHeader({ alg: 'RS256' })
      .sign(await importPrivateKey(PRIVATE_KEY));

    const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
        assertion: jwt,
      }),
    });

    const { access_token } = await tokenResponse.json();

    // === STEP 2: Append data to Google Sheet ===
    const SPREADSHEET_ID = process.env.SPREADSHEET_ID;

    const appendResponse = await fetch(
      `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/July!A1:append?valueInputOption=USER_ENTERED`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${access_token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          values: [data],
        }),
      }
    );

    const result = await appendResponse.json();

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: 'Data successfully added to the sheet!',
        updatedRange: result.updates?.updatedRange || '',
      }),
    };
  } catch (err) {
    console.error('Error:', err);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Internal Server Error', error: err.message }),
    };
  }
};

// Helper: Import RSA private key for jose
async function importPrivateKey(pem) {
  const pkcs8 = pem
    .replace(/-----BEGIN PRIVATE KEY-----/, '')
    .replace(/-----END PRIVATE KEY-----/, '')
    .replace(/\n/g, '');
  const rawKey = Uint8Array.from(Buffer.from(pkcs8, 'base64'));
  return await crypto.subtle.importKey(
    'pkcs8',
    rawKey,
    {
      name: 'RSASSA-PKCS1-v1_5',
      hash: 'SHA-256',
    },
    false,
    ['sign']
  );
}
