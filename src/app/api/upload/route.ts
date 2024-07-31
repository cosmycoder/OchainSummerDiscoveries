import { NextRequest, NextResponse } from 'next/server';
import pinataSDK from '@pinata/sdk';

export async function POST(request: NextRequest) {
  try {
    const pinataApiKey = process.env.PINATA_API_KEY;
    const pinataSecretApiKey = process.env.PINATA_SECRET_API_KEY;
    
    if (!pinataApiKey ||!pinataSecretApiKey) {
      throw new Error('Pinata API keys are not set in the environment variables');
    }
    
    const pinata = new pinataSDK({ pinataApiKey, pinataSecretApiKey});

    const body = await request.json();
    const data = body.data;

    if (!data || Object.keys(data).length === 0) {
      return NextResponse.json({ error: 'No data provided' }, { status: 400 });
    }

    const options = {
      pinataMetadata: {
        name: data.name,
      },
    };

    const result = await pinata.pinJSONToIPFS(data, options);

    return NextResponse.json({ ipfsHash: result.IpfsHash });
  } catch (error) {
    console.error('Error uploading data to IPFS:', error);
    return NextResponse.json({ error: 'Error uploading data to IPFS' }, { status: 500 });
  }
}