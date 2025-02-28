// import toast from 'react-hot-toast';
import { BlobServiceClient } from '@azure/storage-blob';

class ImageService {
  constructor() {
    this.CONTAINER_NAME = 'market-call-images';
    this.SAS_TOKEN =
      'sv=2022-11-02&ss=bfqt&srt=sco&sp=rwdlacupiyx&se=2025-02-28T20:40:09Z&st=2024-03-18T12:40:09Z&spr=https&sig=YCCOe4SKTKqJ9mFIT1qhopbwI1TeZWzYIJJPuBYogh4%3D';
    this.STORAGE_ACCOUNT_NAME = 'predictramcrm805a';

    this.upload_url = `https://${this.STORAGE_ACCOUNT_NAME}.blob.core.windows.net/?${this.SAS_TOKEN}`;

    this.blobService = new BlobServiceClient(this.upload_url);

    this.containerClient = this.blobService.getContainerClient(this.CONTAINER_NAME);
  }

  async upload(image, onProgress) {
    const extension = image.name?.split('.')[1];
    const filename = `${Math.random()?.toString(16).substring(2, 8)}.${extension}`;

    const uploadedFile = await this.containerClient.uploadBlockBlob(`${filename}`, image, 1, {
      onProgress,
    });
    return uploadedFile?.blockBlobClient?.url;
  }

  async delete(imageUrl) {
    const blobName = imageUrl.split('/').pop().split('?')[0];
    console.log(blobName);
    const blobClient = this.containerClient.getBlockBlobClient(blobName);
    await blobClient.deleteIfExists({ deleteSnapshots: 'include' });
  }
}

export default new ImageService();
