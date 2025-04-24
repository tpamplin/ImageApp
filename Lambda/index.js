exports.handler = async (event) => {
    const bucketName = event.Records[0].s3.bucket.name;
    const key = event.Records[0].s3.object.key;
    const filename = key.split("/").pop();

    console.log(`Bucket: ${bucketName}`);
    console.log(`Key: ${key}`);
    console.log(`Filename: ${filename}`);

    return {
        statusCode: 200,
        body: JSON.stringify({
            message: "File Processed Successfully.",
            filename: filename,
        }),
    };
};
