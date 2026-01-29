export default function getCroppedImg(file, crop, zoom) {
  return new Promise((resolve) => {
    const img = document.createElement("img");
    img.src = URL.createObjectURL(file);
    img.onload = () => {
      const canvas = document.createElement("canvas");
      const size = Math.min(img.width, img.height); // square crop
      canvas.width = size;
      canvas.height = size;
      const ctx = canvas.getContext("2d");

      // Draw cropped portion
      ctx.drawImage(
        img,
        crop.x,
        crop.y,
        size / zoom,
        size / zoom,
        0,
        0,
        size,
        size
      );

      canvas.toBlob((blob) => resolve(blob), file.type || "image/jpeg", 0.9);
    };
  });
}
