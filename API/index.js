const { readFile } = require("node:fs/promises");
const {
    S3Client,
    ListBucketsCommand,
    ListObjectsV2Command,
    PutObjectCommand,
    GetObjectCommand,
} = require("@aws-sdk/client-s3");

const fs = require("fs");

const express = require("express");
const app = express();
const port = 8080;

const multer = require("multer");
const upload = multer({ dest: "uploads/" });

app.use(express.static("public"));

const cors = require("cors");
app.use(cors());

require("dotenv").config();

const s3Client = new S3Client({
    region: "us-east-1",

    credentials: {
        accessKeyId: process.env.ACCESS_KEY,
        secretAccessKey: process.env.SECRET_ACCESS_KEY,
    },
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
    const fileName = file.originalname;
    console.log("the file is: ", file, "The filename is: ", fileName);

    const uploadParams = {
        Bucket: bucket,
        Key: fileName,
        Body: await readFile(file.path),
        ContentType: req.file.mimetype,
    };
    console.log(uploadParams);
    const response = await s3Client.send(new PutObjectCommand(uploadParams));
});

/**
 * Get an image by key
 */
app.get("/images/:imageKey", async (req, res) => {
    const imageKey = req.params.imageKey;
    console.log("retrieving ", imageKey);

    const params = {
        Bucket: bucket,
        Key: imageKey,
    };

    console.log(params);
    const data = await s3Client.send(new GetObjectCommand(params));

    console.log(data);
    res.send(data);
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
