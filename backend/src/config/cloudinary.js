import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';
import path from 'path';

const getCloudinaryClient = () => {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME || '',
    api_key: process.env.CLOUDINARY_API_KEY || '',
    api_secret: process.env.CLOUDINARY_API_SECRET || '',
  });
  return cloudinary;
};

export const uploadToCloudinary = async (fileBuffer, originalName, mimeType, folder = 'campusplus') => {
  // If Cloudinary credentials are configured, upload to Cloudinary
  if (process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_SECRET) {
    const client = getCloudinaryClient();
    return new Promise((resolve, reject) => {
      const resourceType = mimeType.includes('pdf') || mimeType.includes('officedocument') ? 'raw' : 'auto';
      const uploadStream = client.uploader.upload_stream(
        {
          folder,
          resource_type: resourceType,
          public_id: `${Date.now()}-${path.parse(originalName).name.replace(/[^a-zA-Z0-9_-]/g, '_')}`,
        },
        (error, result) => {
          if (error) return reject(error);
          resolve({
            url: result.secure_url,
            publicId: result.public_id,
            bytes: result.bytes,
            format: result.format || mimeType,
          });
        }
      );
      uploadStream.end(fileBuffer);
    });
  }

  // Fallback: Store locally in uploads directory if credentials are missing
  const uploadsDir = path.resolve('uploads');
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
  }

  const safeFilename = `${Date.now()}-${originalName.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
  const localFilePath = path.join(uploadsDir, safeFilename);
  fs.writeFileSync(localFilePath, fileBuffer);

  return {
    url: `/uploads/${safeFilename}`,
    publicId: safeFilename,
    bytes: fileBuffer.length,
    format: path.extname(originalName).replace('.', ''),
  };
};

export const deleteFromCloudinary = async (publicId, resourceType = 'raw') => {
  if (process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY) {
    const client = getCloudinaryClient();
    return await client.uploader.destroy(publicId, { resource_type: resourceType });
  }
  const localFilePath = path.resolve('uploads', publicId);
  if (fs.existsSync(localFilePath)) {
    fs.unlinkSync(localFilePath);
  }
  return { result: 'ok' };
};

export default cloudinary;
