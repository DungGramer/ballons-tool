import { fabric } from "fabric";

class CanvasControl {
  canvasElement: HTMLCanvasElement;
  wrapperElement: HTMLDivElement;
  canvas: fabric.Canvas;
  image: string;

  constructor() {}

  init(canvasRef: HTMLCanvasElement, wrapperRef: HTMLDivElement) {
    if (!canvasRef || !wrapperRef) return;
    this.canvasElement = canvasRef;
    this.wrapperElement = wrapperRef;

    this.canvas = new fabric.Canvas(this.canvasElement, {
      selection: false,
      width: this.wrapperElement.clientWidth,
      height: this.wrapperElement.clientHeight,
    });
  }

  setBackground(url) {
    this.image = url;
    fabric.Image.fromURL(url, (img) => {
      this.setBackGroundImage(img);
      this.zoom("fit");
    });
  }

  // getWidthHeightImage(image) {
  //   const img = new Image();
  //   img.src = image;
  //   return {
  //     width: img.width,
  //     height: img.height,
  //     aspectRatio: img.width / img.height,
  //   };
  // }

  // getWrapperArea() {
  //   const area = this.wrapperElement.getBoundingClientRect();
  //   return {
  //     safeAreaX: area.x,
  //     safeAreaY: area.y,
  //     safeAreaWidth: area.width,
  //     safeAreaHeight: area.height,
  //   };
  // }

  zoom(type: "fit" | "zoomIn" | "zoomOut" | "reset" | "fill") {
    console.log(`📕 type - 52:canvas.ts \n`, type);
    if (!this.canvas) return;

    const img = new Image();
    img.src = this.image;
    const { width, height } = img;
    const [widthCanvas, heightCanvas] = [
      this.canvas.getWidth(),
      this.canvas.getHeight(),
    ];

    switch (type) {
      case "fill":
        // Fill width image with width canvas

        if (width > height) {
          // Landscape
          this.canvas.setZoom(widthCanvas / width);
        } else {
          // Portrait
          this.canvas.setZoom(widthCanvas / width);
        }
        this.canvas.setHeight(height * this.canvas.getZoom());

        this.canvas.absolutePan({
          y: 0,
          x: 0,
        });

        return;
      case "zoomIn":
        const zoomRatio = this.canvas.getZoom() + 0.05;
        const center = this.canvas.getCenter();
        this.canvas.zoomToPoint(
          new fabric.Point(center.left, center.top),
          zoomRatio
        );
        return;
      case "zoomOut":
        const zoomRatioOut = this.canvas.getZoom() - 0.05;
        const centerOut = this.canvas.getCenter();
        this.canvas.zoomToPoint(
          new fabric.Point(centerOut.left, centerOut.top),
          zoomRatioOut
        );
        return;
      case "reset":
      case "fit":
      default:
        // Fit height image with height canvas
        this.canvas.setHeight(this.wrapperElement.clientHeight);

        if (width > height) {
          // Landscape
          this.canvas.setZoom(heightCanvas / height);
        } else {
          // Portrait
          this.canvas.setZoom(heightCanvas / height);
        }

        // if (height > heightCanvas) {
        //   this.canvas.setZoom(heightCanvas / height);
        // } else {
        //   this.canvas.setZoom(heightCanvas / height);
        // }

        // Set center image
        this.canvas.absolutePan({
          y: 0,
          x: (width / 2) * this.canvas.getZoom() - widthCanvas / 2,
        });

        return;
    }
  }

  setBackGroundImage(img) {
    // const image = new Image();
    // img.src = this.image;
    const { width, height } = img;
    if (!this.canvas) return;

    this.canvas.setBackgroundImage(
      img,
      this.canvas.renderAll.bind(this.canvas)
    );
  }
}

export default CanvasControl;
