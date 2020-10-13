import { imgurConf } from "../enviromentConf";
import axios from "axios";
import { ToastAndroid } from "react-native";
import S3 from "aws-sdk/clients/s3";
import { Credentials } from "aws-sdk";

export function validatePasswordAtRegister(password, confirmPassword) {
  if (password === confirmPassword) {
    return true;
  }
  return false;
}

export async function takePicture(Permissions, imageStateSetter, picker) {
  await Permissions.askAsync(Permissions.CAMERA);
  const image = await picker.launchCameraAsync({
    allowsEditing: false,
  });
  console.log("ESTO ES IMAGEEEEEEEEEWWWWWWWWWWWWWWWWWWWWW");
  console.log(image);
  const { cancelled, uri } = image;
  imageStateSetter({ image: uri });
}

export function getImageFromDevice(images) {
  let localUri = images.image;
  let filename = localUri.split("/").pop();
  let match = /\.(\w+)$/.exec(filename);
  let type = match ? `image/${match[1]}` : `image`;

  let formData = new FormData();
  formData.append("image", { uri: localUri, name: filename, type });

  return formData;
}

export async function uploadImageAndGetPublicationURI(imageData) {
  console.log("CALL TO IMGUR API");
  return await axios.post(
    imgurConf.IMGUR_URL,
    imageData,
    imgurConf.IMGUR_HEADER
  );
}

export async function getDevicesGeoLocation(
  locator,
  messageSetter,
  geoLocationSetter
) {
  let { status } = await locator.requestPermissionsAsync();
  if (status !== "granted") {
    messageSetter("No acces to geolocation data");
  }

  let location = await locator.getCurrentPositionAsync({});
  const { coords } = location;
  const { latitude, longitude } = coords;
  return { latitude, longitude };
}

export function userAlreadyBeenInAingura(visitedArray, username) {
  return visitedArray.some((user) => user === username);
}

export function showToast(messageToShow) {
  return ToastAndroid.show(messageToShow, ToastAndroid.SHORT);
}

export async function uploadImageOnS3(file) {
  const s3bucket = new S3({
    accessKeyId: "AKIAWLI27SCGA4RTS7VJ",
    secretAccessKey: "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",
    Bucket: "aingura-imgs",
    signatureVersion: "v4",
  });
  s3bucket.createBucket(() => {
    let contentType = "multipart/form-data";
    let contentDeposition = 'inline;filename="' + "filename TEST1" + '"';

    const params = {
      Bucket: "aingura-imgs",
      Key: "test1",
      Body: file,
      ContentDisposition: contentDeposition,
      ContentType: contentType,
    };
    s3bucket.upload(params, (err, data) => {
      if (err) {
        console.log("error in callback " + err);
      }
      console.log("success");
      console.log("Respomse URL : " + data);
    });
  });
}

//export function constructObjectToBackend(ainguraName, ainguraDesc, ainguraApproxLocation, geolocation, userInfo, )
