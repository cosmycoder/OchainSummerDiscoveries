import { NextRequest, NextResponse } from 'next/server';

export const POST = async (request: NextRequest) => {
  try {
    const pinataApiKey = process.env.PINATA_API_KEY;
    const pinataSecretApiKey = process.env.PINATA_SECRET_API_KEY;

    if (!pinataApiKey || !pinataSecretApiKey) {
      throw new Error('Pinata API keys are not set in the environment variables!');
    }

    const body = await request.json();
    const fileName = body.data?.name;
    if (!fileName) {
      return NextResponse.json({ error: 'Invalid file name' }, { status: 400 });
    }

    // Dynamically import Pinata SDK
    const pinataSDK = (await import('@pinata/sdk')).default;
    const pinata = new pinataSDK({ pinataApiKey, pinataSecretApiKey });

    // Fetch the file from Pinata
    const response = await pinata.pinList({
      status: 'pinned',
      metadata: {
        name: fileName,
        keyvalues: {}
      }
    });

    // If file is found
    if (response?.rows?.length > 0) {

      const fileHash = response.rows[0].ipfs_pin_hash;
      // Construct the download URL
      const downloadUrl = `https://gateway.pinata.cloud/ipfs/${fileHash}`;

      return NextResponse.json({ downloadUrl });
    } else {

      return NextResponse.json({ error: 'File not found' }, { status: 404 });
    }
  } catch (error) {

    console.error('Error fetching file from Pinata:', error);

    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}