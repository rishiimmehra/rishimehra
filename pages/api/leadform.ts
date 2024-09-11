import { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';

async function getAccessToken() {
  const refreshToken = process.env.ZOHO_BIGIN_REFRESH_TOKEN;
  const clientId = process.env.ZOHO_BIGIN_CLIENT_ID;
  const clientSecret = process.env.ZOHO_BIGIN_CLIENT_SECRET;
  const authDomain = process.env.ZOHO_AUTH_DOMAIN || 'https://accounts.zoho.in';
  const refreshUrl = `${authDomain}/oauth/v2/token`;

  console.log('Attempting to refresh token...');
  console.log('Refresh Token:', refreshToken?.substring(0, 5) + '...');
  console.log('Client ID:', clientId?.substring(0, 5) + '...');
  console.log('Client Secret:', clientSecret?.substring(0, 5) + '...');
  console.log('Auth Domain:', authDomain);

  try {
    const response = await axios.post(refreshUrl, null, {
      params: {
        refresh_token: refreshToken,
        client_id: clientId,
        client_secret: clientSecret,
        grant_type: 'refresh_token'
      }
    });

    console.log('Token refresh response:', response.data);
    if (response.data.access_token && response.data.api_domain) {
      return { accessToken: response.data.access_token, apiDomain: response.data.api_domain };
    } else {
      throw new Error('Access token or API domain not found in response');
    }
  } catch (error) {
    console.error('Error refreshing token:', error.response ? error.response.data : error.message);
    throw new Error(`Failed to refresh token: ${error.response ? JSON.stringify(error.response.data) : error.message}`);
  }
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { projectTypes, firstName, lastName, email, phoneNumber, projectDetails } = req.body;

  try {
    console.log('Attempting to get a fresh access token...');
    const { accessToken, apiDomain } = await getAccessToken();
    console.log('Access Token obtained:', accessToken?.substring(0, 5) + '...');
    console.log('API Domain:', apiDomain);

    const zohoBiginUrl = `${apiDomain}/bigin/v2/Contacts`;
    console.log('Zoho Bigin URL:', zohoBiginUrl);

    const contactData = {
      data: [{
        First_Name: firstName,
        Last_Name: lastName,
        Email: email,
        Mobile: phoneNumber,
        Project: projectTypes,
        Description: projectDetails,
      }],
    };

    console.log('Sending request to Zoho Bigin...');
    const response = await axios.post(zohoBiginUrl, contactData, {
      headers: {
        'Authorization': `Zoho-oauthtoken ${accessToken}`,
        'Content-Type': 'application/json'
      },
      maxRedirects: 0, // Prevent automatic redirects
    });

    console.log('Zoho Bigin response:', response.data);
    res.status(200).json({ message: 'Form submitted successfully', data: response.data });
  } catch (error) {
    console.error('Error in Zoho Bigin request:', error.response ? error.response.data : error.message);
    if (error.response && error.response.headers['content-type'].includes('text/html')) {
      console.error('Received HTML response instead of JSON. This might indicate a redirect or authentication issue.');
    }
    res.status(500).json({ message: 'Error submitting form', error: error.response ? error.response.data : error.message });
  }
}