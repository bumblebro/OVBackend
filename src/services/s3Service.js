const AWS = require("aws-sdk");
const { v4: uuidv4 } = require("uuid");

// Configure AWS
AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

const s3 = new AWS.S3();

const uploadToS3 = async (file, folder = "media") => {
  try {
    const fileExtension = file.originalname.split(".").pop();
    const fileName = `${folder}/${uuidv4()}.${fileExtension}`;

    const params = {
      Bucket: process.env.AWS_S3_BUCKET,
      Key: fileName,
      Body: file.buffer,
      ContentType: file.mimetype,
      ACL: "public-read",
    };

    const result = await s3.upload(params).promise();
    return result.Location;
  } catch (error) {
    throw new Error(`Failed to upload file to S3: ${error.message}`);
  }
};

const deleteFromS3 = async (fileUrl) => {
  try {
    const key = fileUrl.split("/").slice(-2).join("/"); // Get folder/filename from URL
    const params = {
      Bucket: process.env.AWS_S3_BUCKET,
      Key: key,
    };

    await s3.deleteObject(params).promise();
  } catch (error) {
    throw new Error(`Failed to delete file from S3: ${error.message}`);
  }
};

module.exports = {
  uploadToS3,
  deleteFromS3,
};
