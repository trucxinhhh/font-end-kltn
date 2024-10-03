import React, { useState } from "react";

function ImageUploader() {
  const [imageSrc, setImageSrc] = useState(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
          // Set canvas size to 1:1 aspect ratio (square)
          const canvas = document.createElement("canvas");
          const size = Math.min(img.width, img.height);
          canvas.width = size;
          canvas.height = size;
          const ctx = canvas.getContext("2d");

          // Draw the image centered to maintain 1:1 ratio
          ctx.drawImage(
            img,
            (img.width - size) / 2, // X-axis offset
            (img.height - size) / 2, // Y-axis offset
            size,
            size,
            0,
            0,
            size,
            size
          );

          // Convert canvas back to a data URL (image)
          const dataUrl = canvas.toDataURL();
          setImageSrc(dataUrl);
        };
        img.src = event.target.result;
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div>
      <input
        id="fileInput"
        type="file"
        style={{ display: "none" }}
        onChange={handleImageChange}
      />
      <label htmlFor="fileInput" style={{ cursor: "pointer" }}>
        Upload Image
      </label>
      {imageSrc && <img src={imageSrc} alt="Resized" />}
    </div>
  );
}

export default ImageUploader;
