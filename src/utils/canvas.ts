import { fabric } from "fabric";

class CanvasControl {
  canvasElement: HTMLCanvasElement;
  wrapperElement: HTMLDivElement;
  canvas: fabric.Canvas;
  image: string;

  constructor() {}

  init(canvasRef: HTMLCanvasElement, wrapperRef: HTMLDivElement) {
    this.canvasElement = canvasRef;
    this.wrapperElement = wrapperRef;

    this.canvas = new fabric.Canvas(this.canvasElement, {
      selection: false,
      width: this.wrapperElement.clientWidth,
      height: this.wrapperElement.clientHeight,
    });
  }

  setBackground(url: string) {
    fabric.Image.fromURL(url, (img) => {
      this.image = url;
      this.canvas.setBackgroundImage(
        img,
        this.canvas.renderAll.bind(this.canvas)
      );
      this.zoom.bind(this)("fit");
    });
  }

  zoom(type: "fit" | "zoomIn" | "zoomOut" | "reset" | "fill") {
    const img = this.canvas.backgroundImage.getElement();

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
          this.canvas.setZoom(widthCanvas / width);
        } else {
          // Portrait
          this.canvas.setZoom(heightCanvas / height);
        }

        // Set center image
        this.canvas.absolutePan({
          y: (height / 2) * this.canvas.getZoom() - heightCanvas / 2,
          x: (width / 2) * this.canvas.getZoom() - widthCanvas / 2,
        });

        return;
    }
  }

  addImage(url: string) {
    fabric.Image.fromURL(url, (img) => {
      // remove old image
      Array.from(this.canvas.getObjects()).forEach((obj) => {
        if (obj.type === "image") {
          this.canvas.remove(obj);
        }
      });

      this.canvas.add(img);
    });
  }
}

export default CanvasControl;

export const canvasControl = new CanvasControl();
