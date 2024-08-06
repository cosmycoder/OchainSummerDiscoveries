import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export const POST = async (request: NextRequest) => {
  try {
    const pinataJwt = process.env.PINATA_JWT;
    const pinataGateway = process.env.PINATA_GATEWAY;

    if (!pinataJwt || !pinataGateway) {
      throw new Error('Pinata API keys are not set in the environment variables!');
    }

    const body = await request.json();
    const data = body.data;

    if (!data || Object.keys(data).length === 0) {
      return NextResponse.json({ error: 'No data provided' }, { status: 400 });
    }

    // Dynamically import Pinata SDK
    const pinataSdk = (await import('pinata')).PinataSDK;
    const pinata = new pinataSdk({ pinataJwt, pinataGateway });



    const result = await pinata.upload.json(data).addMetadata({
      name: data.name
    });

    // Fetch the file from Pinata by name
    const response = await pinata.listFiles().name(data.name);

    // If duplicate files are found, unpin the older ones
    if (response?.length > 1) {
      const file = response[1];
      console.log(file);
      const fileHash = file.ipfs_pin_hash;
      await pinata.unpin([fileHash]);
    }

    return NextResponse.json({ ipfsHash: result.IpfsHash });
  } catch (error) {

    console.error('Error uploading data to IPFS:', error);

    return NextResponse.json({ error: 'Error uploading data to IPFS' }, { status: 500 });
  }
}
