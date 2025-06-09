// import AWS from "aws-sdk";
// import { v4 as uuidv4 } from "uuid";
// import env from "../config/env";

// // Configure AWS
// AWS.config.update({
//   accessKeyId: env.AWS_ACCESS_KEY_ID,
//   secretAccessKey: env.AWS_SECRET_ACCESS_KEY,
//   region: env.AWS_REGION,
// });

// const s3 = new AWS.S3();

// export const uploadToS3 = async (
//   file: Express.Multer.File,
//   folder = "media"
// ): Promise<string> => {
//   try {
//     const fileExtension = file.originalname.split(".").pop();
//     const fileName = `${folder}/${uuidv4()}.${fileExtension}`;

//     const params = {
//       Bucket: env.AWS_S3_BUCKET,
//       Key: fileName,
//       Body: file.buffer,
//       ContentType: file.mimetype,
//       ACL: "public-read",
//     };

//     const result = await s3.upload(params).promise();
//     return result.Location;
//   } catch (error) {
//     throw new Error(`Failed to upload file to S3: ${error.message}`);
//   }
// };

// export const deleteFromS3 = async (fileUrl: string): Promise<void> => {
//   try {
//     const key = fileUrl.split("/").slice(-2).join("/"); // Get folder/filename from URL
//     const params = {
//       Bucket: env.AWS_S3_BUCKET,
//       Key: key,
//     };

//     await s3.deleteObject(params).promise();
//   } catch (error) {
//     throw new Error(`Failed to delete file from S3: ${error.message}`);
//   }
// };
