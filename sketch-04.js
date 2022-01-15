const canvasSketch = require("canvas-sketch");
const random = require("canvas-sketch-util/random");
const math = require("canvas-sketch-util/math");
const Tweakpane = require("tweakpane");

const settings = {
  dimensions: [1080, 1080],
  animate: true,
};

const params = {
  cols: 50,
  rows: 22,
  scaleMin: 1,
  scaleMax: 30,
  frequency: -0.006,
  amplitute: 0.43,
  animate: true,
  frame: 0,
  lineCap: "round",
  background: "rgb(255, 25, 189)",
  lineColor: { r: 255, g: 255, b: 0, a: 0.5 },
};

const sketch = () => {
  return ({ context, width, height, frame }) => {
    context.fillStyle = params.background;
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

    for (let i = 0; i < numCells; i++) {
      //creating the grid;

      const col = i % cols; // modulates between 0,1,2,3 as i increases  to find grid in x axis
      const row = Math.floor(i / cols); // when you floor the number  keeps going to 0 until i can be divided by the column # 1/4 = 0 , 2/4 = 0, 3/4 = 0, 4/4 = 1;
      // every 4 steps the value is increased by one

      //find x && y values to find cell values
      const x = col * cellWidth;
      const y = row * cellHeight;
      // draw a line in each cell so find width & height of cell that slightly smaller then the cell
      const w = cellWidth * 0.8;
      const h = cellHeight * 0.8;

      const f = params.animate ? frame : params.frame;

      // const noise = random.noise2D(x + frame * 10, y, params.frequency);  //looks like things are moving from the right
      const noise = random.noise3D(x, y, f * 10, params.frequency);

      //use noise to set the angle of rotation of the lines of the grid.
      const angle = noise * Math.PI * params.amplitute; // -180 to 180 degree
      // const scale = ((noise + 1) / 2) * 30;
      // const scale = noise * 0.5 * 0.5 * 30;
      const scale = math.mapRange(
        noise,
        -1,
        1,
        params.scaleMin,
        params.scaleMax
      );

      context.save();

      context.translate(x, y); // need to take margins into account when we translate the context;
      context.translate(marginX, marginY); /// this is setting the origin to the top left of the grid cell
      context.translate(cellWidth * 0.5, cellHeight * 0.5); // set the orgin to the center of the cell

      context.rotate(angle);

      context.lineWidth = scale;
      context.lineCap = params.lineCap;

      context.beginPath();
      context.strokeStyle = `rgba(${params.lineColor.r}, ${params.lineColor.g}, ${params.lineColor.b}, ${params.lineColor.a})`;

      context.moveTo(w * -0.5, 0);
      context.lineTo(w * 0.5, 0);

      context.stroke();

      context.restore();
    }
  };
};

const createPane = () => {
  const pane = new Tweakpane.Pane();
  let folder;

  folder = pane.addFolder({ title: "Grid" });
  folder.addInput(params, "lineCap", {
    options: { butt: "butt", round: "round", square: "square" },
  });
  folder.addInput(params, "background", { picker: "inline", expanded: true });
  pane.addSeparator();
  folder.addInput(params, "lineColor", { picker: "inline", expanded: true });
  folder.addInput(params, "cols", { min: 2, max: 50, step: 1 });
  folder.addInput(params, "rows", { min: 2, max: 50, step: 1 });
  folder.addInput(params, "scaleMin", { min: 1, max: 100 });
  folder.addInput(params, "scaleMax", { min: 1, max: 100 });

  folder = pane.addFolder({ title: "noise" });
  folder.addInput(params, "frequency", { min: -0.01, max: 0.01 });
  folder.addInput(params, "amplitute", { min: 0, max: 1 });
  folder.addInput(params, "animate");
  folder.addInput(params, "frame", { min: 0, max: 999 });
};

createPane();
canvasSketch(sketch, settings);
