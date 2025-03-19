import { S3Client, PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";

class ImageService {
  constructor() {
    this.BUCKET_NAME = "predictram-main-files"; // Replace with your S3 bucket name
    this.FOLDER_NAME = "market-call-images"; // Replace with your desired folder name
    this.REGION = "us-east-1"; // Replace with your S3 bucket region

    this.s3Client = new S3Client({
      region: this.REGION,
      credentials: {
        accessKeyId: "AKIAWOOXTYZDEPMEVVEA",
        secretAccessKey: "9dcIl93W1zZtSokGsWDGrTB8qfDBgVDucSCXlyic",
      },
    });
  }

  async upload(image, onProgress) {
    try {
      const extension = image.name?.split(".")[1];
      const filename = `${Math.random()
        .toString(16)
        .substring(2, 8)}.${extension}`;

      const params = {
        Bucket: this.BUCKET_NAME,
        Key: `${this.FOLDER_NAME}/${filename}`, // Include the folder name in the Key
        Body: image,
        ContentType: image.type, // Preserve the original file type
      };

      const command = new PutObjectCommand(params);
      await this.s3Client.send(command);

      const fileUrl = `https://${this.BUCKET_NAME}.s3.us-east-1.amazonaws.com/${this.FOLDER_NAME}/${filename}`;

      return fileUrl;
    } catch (error) {
      console.error("Error uploading image:", error);
      throw error;
    }
  }

  async delete(imageUrl) {
    try {
      const blobName = imageUrl.split("/").pop();

      const params = {
        Bucket: this.BUCKET_NAME,
        Key: `${this.FOLDER_NAME}/${blobName}`,
      };

      const command = new DeleteObjectCommand(params);
      await this.s3Client.send(command);

      console.log(`File deleted successfully: ${blobName}`);
    } catch (error) {
      console.error("Error deleting image:", error);
      throw error;
    }
  }
}

export default new ImageService();
