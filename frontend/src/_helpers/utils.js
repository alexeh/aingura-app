import { imgurConf } from "../enviromentConf";
import axios from "axios";
import { ToastAndroid } from "react-native";
import S3 from "aws-sdk/clients/s3";
import { Credentials } from "aws-sdk";
import base64 from "base64-arraybuffer";

import * as fs from "expo-file-system";

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

  imageStateSetter({ image: image.uri });
}

export async function getImageFromDevice(images) {
  let localUri = images.image;
  let filename = localUri.split("/").pop();
  let match = /\.(\w+)$/.exec(filename);
  let type = match ? `image/${match[1]}` : `image`;

  let formData = new FormData();
  formData.append("image", { uri: localUri, name: filename, type });
  const arrayBuffer = await fs.readAsStringAsync(localUri);
  const arrayBuffer1 = base64.decode(arrayBuffer);

  //const arrayBuffer = decode(base64);
  const file = {
    type: type,
    fileName: filename,
    payload: arrayBuffer,
  };

  return file;
}
export async function uploadImageOnS3(file) {
  const s3bucket = new S3({
    accessKeyId: "AKIAWLI27SCGJ34FAJUQ",
    secretAccessKey: "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",
    Bucket: "aingura-imgs",
    signatureVersion: "v4",
  });
  s3bucket.createBucket(() => {
    let contentDeposition = 'inline;filename="' + file.fileName + '"';

    const params = {
      Bucket: "aingura-imgs",
      Key: file.fileName,
      Body: file.payload,
      ContentDisposition: contentDeposition,
      ContentType: file.type,
    };
    console.log("ESTO ES LO QUE COME S3");
    console.log(params);
    s3bucket.upload(params, (err, data) => {
      if (err) {
        console.log("error in callback " + err);
      }
      console.log("success");
      console.log(data);
    });
  });
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

//export function constructObjectToBackend(ainguraName, ainguraDesc, ainguraApproxLocation, geolocation, userInfo, )
