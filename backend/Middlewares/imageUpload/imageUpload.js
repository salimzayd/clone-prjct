import fs from 'fs';
import path from 'path';
import multer from 'multer';
import dotenv from 'dotenv';
dotenv.config();
import cloudinary from 'cloudinary';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const storage = multer.diskStorage({
    destination: path.join(__dirname, 'uploads'),
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname)); // Use path.extname to keep the file extension
    }
});

const upload = multer({ storage });

cloudinary.v2.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET
});

const imageUpload = (req, res, next) => {
    upload.single('image')(req, res, async (err) => {
        if (err) {
            return res.status(400).json({
                error: err.message
            });
        }

        try {
            const result = await cloudinary.v2.uploader.upload(req.file.path, {
                folder: 'FoodFleet-imgs'
            });
            req.body.image = result.secure_url;
            console.log(req.body.image);

            fs.unlink(req.file.path, (unlinkErr) => {
                if (unlinkErr) {
                    console.error("Error deleting local file:", unlinkErr);
                }
            });

            next();
        } catch (error) {
            console.error("Error uploading file to Cloudinary:", error);
            return res.status(500).json({
                message: "Error uploading file to Cloudinary"
            });
        }
    });
};

export default imageUpload;
