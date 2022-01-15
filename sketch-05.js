const canvasSketch = require("canvas-sketch");
const TweakPane = require("tweakpane");
const random = require(`canvas-sketch-util/random`);
const math = require("canvas-sketch-util/math");

const settings = {
  dimensions: [1080, 1080],
};

const params = {
  circleRadius: 0.5,
  cell: 4.35,
  text1: "1",
  text2: "0",
  fontSize: 1.32,
};

let manager;
let text = "Z"; //glyph
let fontSize = 1200;
let fontFamily = "Helvetica"; /// can replace - check out typeContext.text

//canvas is acting like a bitmap
const typeCanvas = document.createElement("canvas");
const typeContext = typeCanvas.getContext("2d");

const sketch = ({ context, width, height }) => {
  //grid props for type canvas
  const cell = params.cell;
  const cols = Math.floor(width / cell); // for every  length  of cell  we will have one pixel in the canvas
  const rows = Math.floor(height / cell);
  const numCells = cols * rows;

  // set dimensions of canvas
  typeCanvas.width = cols;
  typeCanvas.height = rows;

  return ({ context, width, height }) => {
    typeContext.fillStyle = "black";
    typeContext.fillRect(0, 0, cols, rows);

    fontSize = params.fontSize;

    // typeContext.fillStyle = "white";
    // typeContext.font = `${fontSize}px ${fontFamily}`;

    // typeContext.textBaseline = "top";

    //reset background color after each render;
    // context.fillStyle = "blue";
    // context.fillRect(0, 0, width, height);

    // // textalign doesn't really get us to centering the text. by tacking the metrics we can truly center the letter in the page
    // const metrics = typeContext.measureText(text);

    // console.log(metrics);

    // const mx = metrics.actualBoundingBoxLeft * -1;
    // const my = metrics.actualBoundingBoxAscent * -1;
    // const mw = metrics.actualBoundingBoxLeft + metrics.actualBoundingBoxRight;
    // const mh =
    //   metrics.actualBoundingBoxAscent + metrics.actualBoundingBoxDescent;

    // const tx = (cols - mw) * 0.5 - mx; // similiar to grid
    // const ty = (rows - mh) * 0.5 - my; // similiar to grid

    typeContext.save();
    typeContext.drawImage(image, 0, 0, cols, rows); // draw image
    // typeContext.translate(tx, ty);

    // typeContext.beginPath();
    // typeContext.rect(mx, my, mw, mh);
    // typeContext.stroke();

    // typeContext.fillText(text, 0, 0);
    typeContext.restore();

    const typeData = typeContext.getImageData(0, 0, cols, rows).data;
    console.log("whats type data", typeData); // data  = 4(channels)  * width * height
    console.log("yellow", context);

    //read data from array

    context.fillStyle = "black";
    context.fillRect(0, 0, width, height);

    // context.drawImage(typeCanvas, 0, 0);
    context.textBaseline = "middle";
    context.textAlign = "center";

    for (let i = 0; i < numCells; i++) {
      const col = i % cols;
      const row = Math.floor(i / rows);
      const x = col * cell;
      const y = row * cell;

      const r = typeData[i * 4 + 0]; //reading from first channel r
      const g = typeData[i * 4 + 1];
      const b = typeData[i * 4 + 2];
      const a = typeData[i * 4 + 3];

      const glyph = getGlyph(r);

      context.font = `${cell * fontSize}px ${fontFamily}`;
      if (Math.random() < 0.1) context.font = `${cell * 2}px ${fontFamily}`;
      if (glyph !== params.text1 || glyph !== params.text2) {
        context.fillStyle = `purple`;
      }
      if (glyph === params.text1) {
        context.fillStyle = `green`;
      }
      if (glyph === params.text2) {
        context.fillStyle = `#008DDF`;
      }

      context.save();
      context.translate(x, y);
      context.translate(cell * 0.5, cell * 0.5);
      // context.fillStyle = "white";
      // // context.fillRect(0, 0, cell, cell);
      // context.fillStyle = "black";

      context.beginPath();
      //with circle
      // context.arc(0, 0, cell * params.circleRadius, 0, Math.PI * 2);
      // context.fill();

      context.fillText(glyph, 0, 0);
      context.restore();
      // change squares based on colors of image data
    }
  };
};

const getGlyph = (v) => {
  if (v < 50) return params.text1;
  if (v < 100) return params.text1;
  if (v < 150) return params.text2;
  if (v < 200) return params.text2;

  const glyphs = `_=/`.split("");
  return random.pick(glyphs);

  return text;
};

const onKeyUp = (e) => {
  console.log(e);
  text = e.key.toUpperCase();
  manager.render();
};

// document.addEventListener("keyup", onKeyUp);

const createPane = () => {
  const pane = new TweakPane.Pane({ title: "Letter Sketch" });
  let folder;
  folder = pane.addInput(params, "text1").on("change", (ev) => {
    manager.loadAndRun(sketch, settings);
  });
  pane.addInput(params, "text2", {}).on("change", (ev) => {
    manager.loadAndRun(sketch, settings);
  });
  pane
    .addInput(params, "cell", { min: 2, max: 20, step: 0.05 })
    .on("change", (ev) => {
      manager.loadAndRun(sketch, settings);
      // manager.render()
    });
  pane
    .addInput(params, "fontSize", { min: 0.01, max: 15, step: 0.01 })
    .on("change", (ev) => {
      manager.loadAndRun(sketch, settings);
      // manager.render()
    });
};

const loadMeSomeImage = (url) => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject();
    img.src = url;
  });
};

const start = async () => {
  const url = "./tutorial/potrait-example.jpg";
  image = await loadMeSomeImage(url);
  manager = await canvasSketch(sketch, settings);
};

start();
createPane();
