import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export const POST = async (request: NextRequest) => {
  try {
    const pinataApiKey = process.env.PINATA_API_KEY;
    const pinataSecretApiKey = process.env.PINATA_SECRET_API_KEY;

    if (!pinataApiKey || !pinataSecretApiKey) {
      throw new Error('Pinata API keys are not set in the environment variables!');
    }

    const body = await request.json();
    const data = body.data;

    if (!data || Object.keys(data).length === 0) {
      return NextResponse.json({ error: 'No data provided' }, { status: 400 });
    }

    // Dynamically import Pinata SDK
    const pinataSDK = (await import('@pinata/sdk')).default;
    const pinata = new pinataSDK({ pinataApiKey, pinataSecretApiKey });

    const options = {
      pinataMetadata: {
        name: data.name,
      },
    };

    const result = await pinata.pinJSONToIPFS(data, options);

    // Fetch the file from Pinata by name
    const response = await pinata.pinList({
      status: 'pinned',
      metadata: {
        name: data.name,
        keyvalues: {}
      }
    });

    // If duplicate files are found, unpin the older ones
    if (response && response.rows && response.rows.length > 1) {
      const file = response.rows[1];
      console.log(file);
      const fileHash = file.ipfs_pin_hash;
      await pinata.unpin(fileHash);
    }

    return NextResponse.json({ ipfsHash: result.IpfsHash });
  } catch (error) {

    console.error('Error uploading data to IPFS:', error);

    return NextResponse.json({ error: 'Error uploading data to IPFS' }, { status: 500 });
  }
}
