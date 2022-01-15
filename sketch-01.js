//Idea: make a interactive gallery - tv/ screen - connected to a micro controller
//      that turns on when the viewer tap's the on button;
//      have a map that mimics a drawer tool - so user can make art-  to add to the collective piece
const canvasSketch = require("canvas-sketch");
const Tweakpane = require("tweakpane");

const settings = {
  // dimensions: "A4",
  dimensions: [1080, 1080], // good for instagram
  // pixelPerInch: 300,
  // orientation:"landscape"
  // Enable an animation loop
  animate: false,
  // Set loop duration to 3
  duration: 3,
  // Use a small size for better GIF file size
  dimensions: [1080, 1080],
  // Optionally specify a frame rate, defaults to 30
  // fps: 3,
  // playbackRate: "throttle",
};

const params = {
  test: 1,
  cols: 4,
  rows: 4,
  height: 0.5,
  cellWidthMultiplier: 0.8,
  cellHeightMultiplier: 0.8,
  cellLineWidthMultiplier: 15,
};
let manager;

function getRandomArbitrary(min, max) {
  return Math.random() * (max - min) + min;
}

//Ideas for the squares
// album covers of queen albums.
// A night at the opera.

const sketch = () => {
  //todo, make a dynamic grid like there is for the perlin noise grid.
  return ({ context, width, height }) => {
    context.fillStyle = "black";
    context.fillRect(0, 0, width, height);
    const cols = params.cols;
    const rows = params.rows;
    const numCells = cols * rows;

    const gridWidth = width * 0.8;
    const gridHeight = height * 0.8;
    const cellWidth = gridWidth / cols;
    const cellHeight = gridHeight / rows;

    const marginX = (width - gridWidth) * 0.5;
    const marginY = (height - gridHeight) * 0.5;

    const squareWidth = width * params.widthX;
    const squareHeight = Math.random() * (height * 0.2);
    const gap = width * 0.03;
    // const gap = width * 0.03;
    const initialX = width * 0.2;
    const initialY = height * 0.2;

    const offset = getRandomArbitrary(0.01, 5) * width * 0.02;
    let x, y;

    for (let i = 0; i < numCells; i++) {
      const col = i % cols;
      const row = Math.floor(i / cols);

      const x = col * cellWidth;
      const y = row * cellHeight;

      const w = cellWidth * params.cellWidthMultiplier;
      const h = cellHeight * params.cellHeightMultiplier;

      context.save();
      // context.translate(x, y);
      context.translate(marginX, marginY);
      // context.translate(cellWidth * 0.5, cellHeight * 0.5);
      context.lineWidth =
        Math.random() * (Math.random() * params.cellLineWidthMultiplier);
      context.strokeStyle = "white";
      context.strokeRect(x, y, w, h);
      context.restore();
      // for (let j = 0; j < 5; j++) {
      //   //outer square
      //   x = initialX + (squareWidth + gap) * i;
      //   y = initialY + (squareWidth + gap) * j;

      //   //  context.lineWidth= Math.random() * (Math.random() * 15);
      //   //  context.beginPath();
      //   //  context.rect(x, y, squareWidth , squareHeight); //idea:diamond angle
      //   //  context.stroke();

      //   context.lineWidth = Math.random() * (Math.random() * 15);
      //   context.strokeStyle = "white";
      //   context.strokeRect(x, y, squareWidth, squareHeight);

      //   if (Math.random() > 0.5) {
      //     context.beginPath();
      //     context.strokeStyle =
      //       Math.random() > 0.5
      //         ? Math.random() > 0.7
      //           ? "blue"
      //           : "red"
      //         : "yellow";
      //     context.strokeRect(
      //       x - offset / 2,
      //       y - offset / 2,
      //       squareWidth - offset,
      //       squareHeight - offset
      //     );
      //     context.stroke();

      //     context.beginPath();
      //     context.fillStyle =
      //       Math.random() > 0.5
      //         ? Math.random() > 0.7
      //           ? "red"
      //           : "blue"
      //         : "yellow";
      //     context.fillRect(
      //       x + offset / 2,
      //       y + offset / 2,
      //       squareWidth - offset * Math.random(),
      //       squareHeight - offset
      //     );
      //     context.stroke();
      //   }
      // }
    }
  };
};
const createPane = () => {
  const pane = new Tweakpane.Pane();
  let folder;
  folder = pane.addInput(params, "test", {});
  pane
    .addInput(params, "cellWidthMultiplier", {
      label: "square width multiplier",
      min: 0.01,
      max: 2,
      step: 0.01,
    })
    .on("change", () => {
      manager.render();
    });
  pane
    .addInput(params, "cellHeightMultiplier", {
      label: "square height multiplier",
      min: 0.01,
      max: 2,
      step: 0.01,
    })
    .on("change", () => {
      manager.render();
    });
  pane
    .addInput(params, "cellLineWidthMultiplier", {
      label: "line width multiplier",
      min: 1,
      max: 25,
      step: 1,
    })
    .on("change", () => {
      manager.render();
    });

  pane
    .addInput(params, "cols", { min: 1, max: 100, step: 1 })
    .on("change", () => {
      manager.render();
    });
  pane
    .addInput(params, "rows", { min: 1, max: 100, step: 1 })
    .on("change", () => {
      manager.render();
    });
};

const start = async () => {
  manager = await canvasSketch(sketch, settings);
};

// Service function for all the sketches that creates the pane for you.
createPane();
start();
