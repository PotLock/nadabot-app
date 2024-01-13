import { NextApiRequest, NextApiResponse } from "next";

const PINATA_JWT_AUTH = `Bearer ${process.env.PINATA_JWT}`;

// converts base64 files to Blob
function DataURIToBlob(dataURI: string) {
  const splitDataURI = dataURI.split(",");
  const byteString =
    splitDataURI[0].indexOf("base64") >= 0
      ? atob(splitDataURI[1])
      : decodeURI(splitDataURI[1]);
  const mimeString = splitDataURI[0].split(":")[1].split(";")[0];

  const ia = new Uint8Array(byteString.length);
  for (let i = 0; i < byteString.length; i++) ia[i] = byteString.charCodeAt(i);

  return new Blob([ia], { type: mimeString });
}

async function POST(request: NextApiRequest, response: NextApiResponse) {
  try {
    const payload = JSON.parse(request.body) as { base64Image: string };
    const file = DataURIToBlob(payload.base64Image);

    const data = new FormData();
    data.append(
      "file",
      file,
      `${Date.now()}-${Math.round(Math.random() * Date.now())}`
    );
    data.append("pinataMetadata", JSON.stringify({ name: "File to upload" }));

    const res = await fetch("https://api.pinata.cloud/pinning/pinFileToIPFS", {
      method: "POST",
      headers: {
        Authorization: PINATA_JWT_AUTH,
      },
      body: data,
    });

    const { IpfsHash } = await res.json();
    response.json({ IpfsHash });
  } catch (e) {
    console.log(e);
    response.status(500).json({ error: "Internal Server Error" });
  }
}

async function GET(response: NextApiResponse) {
  try {
    const res = await fetch(
      "https://api.pinata.cloud/data/pinList?status=pinned",
      {
        method: "GET",
        headers: {
          Authorization: PINATA_JWT_AUTH,
        },
      }
    );
    const resData = await res.json();
    const files = resData.rows[0];
    response.json({ files });
  } catch (e) {
    console.log(e);
    response.status(500).json({ error: "Internal Server Error" });
  }
}

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "POST") {
    return POST(req, res);
  } else {
    return GET(res);
  }
};

export default handler;
