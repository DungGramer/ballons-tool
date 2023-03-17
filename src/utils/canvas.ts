import { fabric } from "fabric";

class CanvasControl {
  canvasElement: HTMLCanvasElement;
  wrapperElement: HTMLDivElement;
  canvas: fabric.Canvas;
  image: string;
  toggleText: boolean = false;
  undoStack: any[] = [];
  redoStack: any[] = [];
  pauseSaving: boolean = false;

  constructor() {}

  init(canvasRef: HTMLCanvasElement, wrapperRef: HTMLDivElement) {
    that.canvasElement = canvasRef;
    that.wrapperElement = wrapperRef;

    if (that.canvas) return;

    that.canvas = new fabric.Canvas(that.canvasElement, {
      selection: false,
      width: that.wrapperElement.clientWidth,
      height: that.wrapperElement.clientHeight,
    });

    that.canvas.on("object:added", (e) => {
      if (!that.pauseSaving) {
        console.log(`📕 added \n`, that.undoStack, that.redoStack);
        that.undoStack.push(JSON.stringify(that.canvas));
        that.redoStack = [];
      }
    });

    that.canvas.on("object:modified", (e) => {
      if (!that.pauseSaving) {
        console.log(`📕 modified \n`, that.undoStack, that.redoStack);
        that.undoStack.push(JSON.stringify(that.canvas));
        that.redoStack = [];
      }
    });

    that.canvas.on("object:removed", (e) => {
      if (!that.pauseSaving) {
        console.log(`📕 removed \n`, that.undoStack, that.redoStack);
        that.undoStack.push(JSON.stringify(that.canvas));
        that.redoStack = [];
      }
    });
  }

  setBackground(url: string) {
    that.removeOldImage();
    fabric.Image.fromURL(url, (img) => {
      that.image = url;
      that.canvas.setBackgroundImage(
        img,
        that.canvas.renderAll.bind(that.canvas)
      );
      that.zoom("fit");
    });
  }

  zoom(type: "fit" | "zoomIn" | "zoomOut" | "reset" | "fill") {
    const img = that.canvas.backgroundImage.getElement();

    const { width, height } = img;
    const [widthCanvas, heightCanvas] = [
      that.canvas.getWidth(),
      that.canvas.getHeight(),
    ];

    switch (type) {
      case "fill":
        // Fill width image with width canvas

        if (width > height) {
          // Landscape
          that.canvas.setZoom(widthCanvas / width);
        } else {
          // Portrait
          that.canvas.setZoom(widthCanvas / width);
        }
        that.canvas.setHeight(height * that.canvas.getZoom());

        that.canvas.absolutePan({
          y: 0,
          x: 0,
        });

        return;
      case "zoomIn":
        const zoomRatio = that.canvas.getZoom() + 0.05;
        const center = that.canvas.getCenter();
        that.canvas.zoomToPoint(
          new fabric.Point(center.left, center.top),
          zoomRatio
        );
        return;
      case "zoomOut":
        const zoomRatioOut = that.canvas.getZoom() - 0.05;
        const centerOut = that.canvas.getCenter();
        that.canvas.zoomToPoint(
          new fabric.Point(centerOut.left, centerOut.top),
          zoomRatioOut
        );
        return;
      case "reset":
      case "fit":
      default:
        // Fit height image with height canvas
        that.canvas.setHeight(that.wrapperElement.clientHeight);

        if (width > height) {
          // Landscape
          that.canvas.setZoom(widthCanvas / width);
        } else {
          // Portrait
          that.canvas.setZoom(heightCanvas / height);
        }

        // Set center image
        that.canvas.absolutePan({
          y: (height / 2) * that.canvas.getZoom() - heightCanvas / 2,
          x: (width / 2) * that.canvas.getZoom() - widthCanvas / 2,
        });

        return;
    }
  }

  addImage(url: string) {
    fabric.Image.fromURL(url, (img) => {
      const fabricImage = new fabric.Image(img.getElement(), {
        selectable: false,
        evented: false,
      });

      that.removeOldImage();
      that.canvas.add(fabricImage);
      that.setAutoLayer();
    });
  }

  removeOldImage() {
    Array.from(that.canvas.getObjects()).forEach((obj) => {
      if (obj.type === "image") {
        that.canvas.remove(obj);
      }
    });
  }

  addBrush() {
    if (this.canvas.isDrawingMode) {
      this.canvas.isDrawingMode = false;
      return;
    }

    this.canvas.isDrawingMode = true;
    this.canvas.freeDrawingBrush.color = "#000";
    this.canvas.freeDrawingBrush.width = 5;
  }

  addText() {
    const center = that.canvas.getCenter();
    that.canvas.add(
      new fabric.IText("Tap and Type", {
        left: center.left,
        top: center.top,
        fontFamily: "Helvetica",
        fill: "#000",
        fontSize: 40,
        textAlign: "center",
      })
    );
  }

  editText(config: { fill?: string }) {
    const active = that.canvas.getActiveObject();
    if (active && active.type === "i-text") {
      active.set(config);
      that.canvas.renderAll();
    }
  }

  undo() {
    that.pauseSaving = true;
    that.redoStack.push(that.undoStack.pop());
    console.log(that.undoStack);
    let prev = that.undoStack[that.undoStack.length - 1];
    prev ||= `{}`;

    that.canvas.loadFromJSON(prev, () => {
      that.canvas.renderAll();
      that.pauseSaving = false;
    });
  }

  redo() {
    that.pauseSaving = true;
    let state = that.redoStack.pop();
    if (state) {
      that.undoStack.push(state);
      that.canvas.loadFromJSON(state, () => {
        that.canvas.renderAll();
        that.pauseSaving = false;
      });
    }
  }

  shortcut(e: KeyboardEvent) {
    const activeObj = that.canvas.getActiveObject();
    const notEditText = activeObj?.isEditing;

    if (e.key === "z" && e.ctrlKey) {
      that.undo();
    } else if (e.key === "y" && e.ctrlKey) {
      that.redo();
    } else if (e.key === "t" && e.ctrlKey) {
      that.addText();
    } else if (e.key === "Delete" && !notEditText) {
      that.canvas.remove(that.canvas.getActiveObject() as any);
    }
  }

  mouseWheel(e: WheelEvent) {
    // Get image object
    const imageLayer = that.canvas
      .getObjects()
      .find((obj) => obj.type === "image");

    if (imageLayer) {
      // Set image is active
      that.canvas.setActiveObject(imageLayer);
    }

    // const imageLayer = that.canvas.getActiveObject();
    if (imageLayer && imageLayer.type === "image") {
      const opacity = imageLayer.get("opacity") || 1;

      const opacityResult = opacity + e.deltaY / 2500;
      if (opacityResult < 0 || opacityResult > 1) return;

      imageLayer.set({ opacity: opacityResult });
      that.canvas.renderAll();
    }
  }

  exportJSON() {
    return that.canvas.toJSON();
  }

  importJSON(json: string) {
    that.canvas.loadFromJSON(json, () => {
      that.canvas.renderAll();
      that.zoom("fit");
      that.setAutoLayer();
    });
  }

  setAutoLayer() {
    that.canvas.getObjects().forEach((obj) => {
      if (obj.type === "i-text") {
        that.canvas.bringToFront(obj);
      }

      if (obj.type === "image") {
        obj.set({
          selectable: false,
          evented: false,
        });
        that.canvas.sendToBack(obj);
      }
    });
  }

  clear() {
    that.canvas.clear();
  }
}

export default CanvasControl;

const that = new CanvasControl();

export { that as canvasControl };
