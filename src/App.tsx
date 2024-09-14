import React, { useState } from "react";
import "./App.css";
import FileInput from "./components/FileInput.tsx";
import ImageCropper from "./components/ImageCropper.tsx";

type ImgCroppedArea = {
  x: number;
  y: number;
  width: number;
  height: number;
};

function App() {
  const [image, setImage] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<
    "choose-img" | "crop-img" | "img-cropped"
  >("choose-img");
  const [imgAfterCrop, setImgAfterCrop] = useState<string>("");

  const onImageSelected = (selectedImg: string | ArrayBuffer | null) => {
    if (typeof selectedImg === "string") {
      setImage(selectedImg);
      setCurrentPage("crop-img");
    } else {
      console.error("Selected image is not a valid string.");
    }
  };

  const onCropDone = (imgCroppedArea: ImgCroppedArea | null) => {
    if (imgCroppedArea === null) {
      console.error("Cropped area is null.");
      return;
    }

    const canvasEle = document.createElement("canvas");
    canvasEle.width = imgCroppedArea.width;
    canvasEle.height = imgCroppedArea.height;

    const context = canvasEle.getContext("2d");

    if (!context) return;

    // Load the selected image
    let imageObj1 = new Image();
    imageObj1.src = image;
    imageObj1.onload = function () {
      context.drawImage(
        imageObj1,
        imgCroppedArea.x,
        imgCroppedArea.y,
        imgCroppedArea.width,
        imgCroppedArea.height,
        0,
        0,
        imgCroppedArea.width,
        imgCroppedArea.height
      );

      const dataURL = canvasEle.toDataURL("image/jpeg");
      setImgAfterCrop(dataURL);
      setCurrentPage("img-cropped");
    };
  };

  const onCropCancel = () => {
    setCurrentPage("choose-img");
    setImage("");
  };

  return (
    <div className="container">
      {currentPage === "choose-img" ? (
        <FileInput onImageSelected={onImageSelected} />
      ) : currentPage === "crop-img" ? (
        <ImageCropper
          image={image}
          onCropDone={onCropDone}
          onCropCancel={onCropCancel}
        />
      ) : (
        <div>
          <div>
            <img
              src={imgAfterCrop}
              alt="img-after-crop"
              className="cropped-img"
            />
          </div>

          <button
            onClick={() => {
              setCurrentPage("crop-img");
            }}
            className="btn"
          >
            Crop
          </button>

          <button
            onClick={() => {
              setCurrentPage("choose-img");
              setImage("");
            }}
            className="btn"
          >
            New Image
          </button>
        </div>
      )}
    </div>
  );
}

export default App;
