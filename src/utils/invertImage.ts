function invertImage(url: string) {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  const image = new Image();
  image.src = url;
  image.crossOrigin = 'Anonymous';

  return new Promise((res, rej) => {
    image.onload = () => {
      canvas.width = image.width;
      canvas.height = image.height;

      ctx.drawImage(image, 0, 0);

      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;

      // Delete black pixels
      for (let i = 0; i < data.length; i += 4) {
        if (data[i] === 0 && data[i + 1] === 0 && data[i + 2] === 0) {
          data[i + 3] = 0;
        }
      }

      ctx.putImageData(imageData, 0, 0);
      res(canvas.toDataURL());
    };
  });
}

export default invertImage;
