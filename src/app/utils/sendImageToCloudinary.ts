import { v2 as cloudinary } from 'cloudinary';
import config from '../config';

export const sendImageToCloudinary = async () => {
  cloudinary.config({
    cloud_name: config.cloudinary_name,
    api_key: config.cloduinary_api_key,
    api_secret: config.cloduinary_api_secret,
  });

  await cloudinary.uploader
    .upload(
      'https://res.cloudinary.com/demo/image/upload/getting-started/shoes.jpg',
      {
        public_id: 'shoes',
      },
    )
    .catch((error) => {
      console.log(error);
    });
};
