import { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { projectTypes, firstName, lastName, email, phoneNumber, projectDetails } = req.body;

  // Updated URL for Zoho Bigin V2
  const zohoBiginUrl = 'https://www.zohoapis.com/bigin/v2/Contacts';
  const zohoBiginAuth = `Zoho-oauthtoken ${process.env.ZOHO_BIGIN_ACCESS_TOKEN}`;

  const contactData = {
    data: [{
      First_Name: firstName,
      Last_Name: lastName,
      Email: email,
      Phone: phoneNumber,
      Project: projectTypes.join(", "),
      Description: projectDetails,
    }],
  };

  try {
    const response = await axios.post(zohoBiginUrl, contactData, {
      headers: {
        'Authorization': zohoBiginAuth,
        'Content-Type': 'application/json'
      }
    });

    res.status(200).json({ message: 'Form submitted successfully', data: response.data });
  } catch (error) {
    console.error('Error response:', error.response ? error.response.data : error.message);
    res.status(500).json({ message: 'Error submitting form', error: error.response ? error.response.data : error.message });
  }
}