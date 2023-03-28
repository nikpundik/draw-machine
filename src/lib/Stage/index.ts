import { MouseEvent } from "react";
import { Color, colors, fillColors } from "../../utils/colors";
import { Tool, tools } from "../../utils/tools";
import { StageArgs } from "./types";

class Stage {
  mainCanvas: HTMLCanvasElement;
  supportCanvas: HTMLCanvasElement;
  mainCtx: CanvasRenderingContext2D;
  supportCtx: CanvasRenderingContext2D;
  tool: Tool;
  strokeColor!: Color;
  fillColor!: Color;
  strokeWidth!: number;
  prev: { x: number; y: number };
  history: ImageData[];

  constructor({ mainCanvas, supportCanvas }: StageArgs) {
    const mainCtx = mainCanvas.getContext("2d");
    const supportCtx = supportCanvas.getContext("2d");
    if (!mainCtx || !supportCtx) {
      throw new Error("Failed to get 2d context");
    }
    this.mainCanvas = mainCanvas;
    this.mainCtx = mainCtx;
    this.mainCtx.lineCap = "round";
    this.supportCanvas = supportCanvas;
    this.supportCtx = supportCtx;
    this.tool = tools[0];
    // ???
    setTimeout(() => {
      this.setFillColor(fillColors[0]);
      this.setStrokeColor(colors[0]);
      this.setStrokeWidth(5);
    }, 0);
    this.setFillColor(fillColors[0]);
    this.setStrokeColor(colors[0]);
    this.setStrokeWidth(5);
    this.prev = { x: 0, y: 0 };
    this.history = [];
  }

  updateHistory() {
    const dataUrl = this.mainCtx.getImageData(
      0,
      0,
      this.mainCanvas.width,
      this.mainCtx.canvas.height
    );
    this.history.push(dataUrl);
    if (this.history.length > 10) {
      this.history.shift();
    }
  }

  hasHistory() {
    return this.history.length > 0;
  }

  undo() {
    this.history.pop();
    const imageData = this.history[this.history.length - 1];
    this.mainCtx.putImageData(imageData, 0, 0);
  }

  redraw() {
    const imageData = this.history[this.history.length - 1];
    if (imageData) {
      this.mainCtx.putImageData(imageData, 0, 0);
    }
  }

  setFillColor(color: Color) {
    this.fillColor = color;
    this.mainCtx.fillStyle = color.hex;
    this.supportCtx.fillStyle = color.hex;
  }

  setStrokeColor(color: Color) {
    this.mainCtx.beginPath();
    this.strokeColor = color;
    this.mainCtx.strokeStyle = color.hex;
    this.supportCtx.strokeStyle = color.hex;
  }

  setStrokeWidth(width: number) {
    this.strokeWidth = width;
    this.mainCtx.lineWidth = width;
    this.supportCtx.lineWidth = width;
  }

  getMousePosition(event: MouseEvent<HTMLCanvasElement>) {
    const rect = this.supportCanvas.getBoundingClientRect();
    const scaleX = this.supportCanvas.width / rect.width;
    const scaleY = this.supportCanvas.height / rect.height;
    return {
      x: (event.clientX - rect.left) * scaleX,
      y: (event.clientY - rect.top) * scaleY,
    };
  }

  setPosition(event: MouseEvent<HTMLCanvasElement>) {
    const { x, y } = this.getMousePosition(event);
    this.prev = { x, y };
  }

  drawLine(event: MouseEvent<HTMLCanvasElement>) {
    const { x, y } = this.getMousePosition(event);
    const ctx = this.mainCtx;
    ctx.beginPath();
    ctx.lineCap = "round";
    ctx.moveTo(this.prev.x, this.prev.y);
    ctx.lineTo(x, y);
    ctx.stroke();
    ctx.closePath();
    this.prev = { x, y };
  }

  drawRect(
    event: MouseEvent<HTMLCanvasElement>,
    layer: "main" | "support" = "main"
  ) {
    const { x, y } = this.getMousePosition(event);
    const ctx = layer === "main" ? this.mainCtx : this.supportCtx;
    ctx.beginPath();
    ctx.rect(this.prev.x, this.prev.y, x - this.prev.x, y - this.prev.y);
    ctx.fill();
    ctx.stroke();
    ctx.closePath();
  }

  drawCircle(
    event: MouseEvent<HTMLCanvasElement>,
    layer: "main" | "support" = "main"
  ) {
    const { x, y } = this.getMousePosition(event);
    const ctx = layer === "main" ? this.mainCtx : this.supportCtx;
    ctx.beginPath();
    const radius = Math.abs((x - this.prev.x + (y - this.prev.y)) / 2);
    ctx.closePath();
    ctx.beginPath();
    ctx.arc(this.prev.x, this.prev.y, radius, 0, 2 * Math.PI);
    ctx.fill();
    ctx.stroke();
    ctx.closePath();
  }

  drawEllipse(
    event: MouseEvent<HTMLCanvasElement>,
    layer: "main" | "support" = "main"
  ) {
    const { x, y } = this.getMousePosition(event);
    const ctx = layer === "main" ? this.mainCtx : this.supportCtx;
    ctx.beginPath();
    ctx.closePath();
    ctx.beginPath();
    ctx.ellipse(
      this.prev.x,
      this.prev.y,
      Math.abs(x - this.prev.x),
      Math.abs(y - this.prev.y),
      0,
      0,
      2 * Math.PI
    );
    ctx.fill();
    ctx.stroke();
    ctx.closePath();
  }

  clearSupport() {
    this.supportCtx.clearRect(
      0,
      0,
      this.supportCanvas.width,
      this.supportCanvas.height
    );
  }

  setFullScreen() {
    this.mainCanvas.height = window.innerHeight;
    this.mainCanvas.width = window.innerWidth;
    this.supportCanvas.height = window.innerHeight;
    this.supportCanvas.width = window.innerWidth;
  }
}

export default Stage;
