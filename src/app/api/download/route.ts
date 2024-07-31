import { NextRequest, NextResponse } from 'next/server';
import pinataSDK from '@pinata/sdk';

const pinataApiKey = process.env.PINATA_API_KEY;
const pinataSecretApiKey = process.env.PINATA_SECRET_API_KEY;

if (!pinataApiKey ||!pinataSecretApiKey) {
  throw new Error('Pinata API keys are not set in the environment variables');
}

const pinata = new pinataSDK({ pinataApiKey, pinataSecretApiKey});

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const fileName = searchParams.get('name');

    if (!fileName) {
      return NextResponse.json({ error: 'Invalid file name' }, { status: 400 });
    }

    try {
      // Fetch the file from Pinata
      const response = await pinata.pinList({
        status: 'pinned',
        metadata: {
          name: fileName,
          keyvalues: {}
        }});

      // If file is found
      if (response && response.rows && response.rows.length > 0) {
        const file = response.rows[0];
        const fileHash = file.ipfs_pin_hash;

        // Construct the download URL
        const downloadUrl = `https://gateway.pinata.cloud/ipfs/${fileHash}`;

        return NextResponse.json({ downloadUrl });
      } else {
        return NextResponse.json({ error: 'File not found' }, { status: 404 });
      }
    } catch (error) {
      console.error(error);
      return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}