import { NextRequest, NextResponse } from 'next/server';

export const POST = async (request: NextRequest) => {
  try {
    const pinataJwt = process.env.PINATA_JWT;
    const pinataGateway = process.env.PINATA_GATEWAY;

    if (!pinataJwt || !pinataGateway) {
      throw new Error('Pinata API keys are not set in the environment variables!');
    }

    const body = await request.json();
    const fileName = body.data?.name;
    if (!fileName) {
      return NextResponse.json({ error: 'Invalid file name' }, { status: 400 });
    }

    // Dynamically import Pinata SDK
    const pinataSdk = (await import('pinata')).PinataSDK;
    const pinata = new pinataSdk({ pinataJwt, pinataGateway });

    // Fetch the file from Pinata
    const response = await pinata.listFiles().name(fileName);


    // If file is found
    if (response?.length > 0) {

      const fileHash = response[0].ipfs_pin_hash;
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