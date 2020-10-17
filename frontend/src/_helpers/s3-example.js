const uploadImageOnS3 = async (file) => {
  const s3bucket = new S3({
    accessKeyId: "1",
    secretAccessKey: "2",
    Bucket: "3",
    signatureVersion: "v4",
  });
  let contentType = "image/jpeg";
  let contentDeposition = 'inline;filename="' + file.name + '"';
  const base64 = await fs.readFile(file.uri, "base64");
  const arrayBuffer = decode(base64);
  s3bucket.createBucket(() => {
    const params = {
      Bucket: "a",
      Key: file.name,
      Body: arrayBuffer,
      ContentDisposition: contentDeposition,
      ContentType: contentType,
    };
    s3bucket.upload(params, (err, data) => {
      if (err) {
        console.log("error in callback");
      }
      console.log("success");
      console.log("Respomse URL : " + data.Location);
    });
  });
};
