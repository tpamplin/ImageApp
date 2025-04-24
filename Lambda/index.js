import { S3 } from "@aws-sdk/client-s3";

import sharp from "sharp";

const s3 = new S3();

exports.handler = async (event) => {
    const bucketName = event.Records[0].s3.bucket.name;
    const key = event.Records[0].s3.object.key;
    const filename = key.split("/").pop();

    console.log(`Bucket: ${bucketName}`);
    console.log(`Key: ${key}`);
    console.log(`Filename: ${filename}`);

    if (!key.startsWith("original/")) {
        console.log("Image does not require processing.");
        return { statusCode: 200, body: "No Processing Required" };
    }

    try {
        const { Body, ContentType } = await s3.GetObject({
            Bucket: bucketName,
            Key: key,
        });

        const imageBuffer = await Body.transformToByteArray();

        const imageThumbnail = await sharp(imageBuffer).resize(200, 200, { fit: "inside" }).toBuffer();

        const outputKey = `thumbnails/${filename}`;

        await s3.putObject({
            Bucket: bucketName,
            Key: outputKey,
            Body: imageThumbnail,
            ContentType: ContentType,
        });

        return {
            statusCode: 200,
            body: "File processed Successfully",
        };
    } catch (error) {
        console.error("Error: ", error);
        return { statuscode: 500, body: "Error processing image, something is broken: " + error };
    }
};
