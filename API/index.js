const { S3Client, ListBucketsCommand, ListObjectsV2Command, PutObjectCommand } = require("@aws-sdk/client-s3");

const fs = require("fs");

const multer = require("multer");
const upload = multer({ dest: "uploads/" });

const express = require("express");
const app = express();
const port = 8080;

app.use(express.static("public"));

require("dotenv").config();

const s3Client = new S3Client({
    region: "us-east-1",
    endpoint: process.env.AWS_ENDPOINT,
    forcePathStyle: true,
});

const bucket = process.env.AWS_BUCKET;

async function listBuckets() {
    try {
        const response = await s3Client.send(new ListBucketsCommand());
        console.log("buckets: ", response.Buckets);
    } catch (error) {
        console.error(error);
    }
}

listBuckets();

/**
 *  Get a list of all images
 */
app.get("/images", async (req, res) => {
    const listObjectsParams = {
        Bucket: bucket,
    };
    listObjectsCmd = new ListObjectsV2Command(listObjectsParams);
    const response = await s3Client.send(listObjectsCmd);

    const imageFiles = (response.Contents || [])
        .filter((file) => /\.(jpg|jpeg|png|gif)$/i.test(file.Key))
        .map((file) => file.Key);

    res.json(imageFiles);
});

/**
 * Upload an image
 */
app.post("/images", upload.single("file"), async (req, res) => {
    const file = req.file;
    const fileName = req.file.originalname;
    console.log(file, fileName);
    const uploadParams = {
        Bucket: bucket,
        Key: fileName,
        Body: req.file.buffer,
        ContentType: req.file.mimetype,
    };
    const response = await s3Client.send(new PutObjectCommand(uploadParams));
    res.send(response);
});

/**
 * Get an image by key
 */
app.get("images/:imageKey", (req, res) => {
    const imageKey = req.params.imageKey;

    const params = {
        Bucket: bucket,
        Key: fileName,
    };

    s3.getObject(params, (err, data) => {
        if (err) {
            return res.status(500).send("Error retrieving image from S3");
        }

        res.setHeader("Content-Type", data.ContentType);

        res.send(data.Body);
    });
});

/**
 * Default -- Test
 */
app.get("/", (req, res) => {
    res.send("Hello, World!");
});

app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});
