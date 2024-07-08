import {google} from 'googleapis'
import fs from 'fs'
const CLIENT_ID=process.env.GOOGLE_CLIENT_ID!!;
const CLIENT_SECRET=process.env.GOOGLE_CLIENT_SECRET!!;
const REDIRECT_URI=process.env.GOOGLE_REDIRECT_URI!!;
const REFRESH_TOKEN=process.env.GOOGLE_REFRESH_TOKEN!!;

const oAuth2Client = new google.auth.OAuth2(CLIENT_ID,CLIENT_SECRET,REDIRECT_URI);
oAuth2Client.setCredentials({refresh_token:REFRESH_TOKEN});
const drive = google.drive({ version: 'v3', auth: oAuth2Client });
export async function uploadFile(filePath:string, mimeType:any) {
    const response = await drive.files.create({
      requestBody: {
        name: 'sample.pdf',
        mimeType: mimeType
      },
      media: {
        mimeType: mimeType,
        body: fs.createReadStream(filePath)
      }
    });
    return response.data;
  }