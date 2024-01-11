/**
 * Upload file to IPFS using Pinata
 * @param fileToUpload
 * @returns
 */
export const uploadFile = async (fileToUpload: string | Blob) => {
  const data = new FormData();
  data.set("file", fileToUpload);

  try {
    const response = await fetch("/api/files", {
      method: "POST",
      body: data,
    });

    const ipfsHash = await response.text();
    return ipfsHash;
  } catch (error) {
    console.error(error);
  }
};
