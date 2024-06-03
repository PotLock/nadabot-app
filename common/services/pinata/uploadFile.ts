/**
 * Upload file to IPFS using Pinata
 * @param fileToUpload
 * @returns {string} uploaded image CID
 */
export const uploadFile = async (base64Image: string) => {
  try {
    const response = await fetch("/api/files", {
      method: "POST",
      body: JSON.stringify({ base64Image }),
    });

    const ipfsHashJson = await response.json();
    return ipfsHashJson.IpfsHash;
  } catch (error) {
    console.error(error);
  }
};
