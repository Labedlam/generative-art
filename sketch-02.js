const canvasSketch = require("canvas-sketch");
const random = require("canvas-sketch-util/random");
const math = require("canvas-sketch-util/math");
const TweakPane = require("tweakpane");

const settings = {
  dimensions: [1080, 1080],
  animate: true,
  // Set loop duration to 3
  duration: 50,
  fps: 1,
  playbackRate: "throttle",
};

const params = {
  sliceNumber: 500,
};

//TODO: when the input changes, trigger a redraw
const sketch = () => {
  return ({ context, width, height }) => {
    context.fillStyle = random.pick([
      "white",
      "#EC5787",
      "#5373FE",
      "#FFAC33",
      "#F07CA5",
      "#141B52",
      "black",
    ]);
    context.fillRect(0, 0, width, height);

    context.fillStyle = "black";

    const cx = width * 0.5;
    const cy = height * 0.5;

    const w = width * 0.01;
    const h = height * 0.1;
    let x, y;

    const numberOfSlices = params.sliceNumber;
    // random.range(6, 800);
    // const numberOfSlices = 8
    // const radius = random.range(width * -0.5, width * 0.5) ;
    const radius = width * 0.3;

    for (let i = 0; i < numberOfSlices; i++) {
      const slice = math.degToRad(360 / numberOfSlices);
      const angle = slice * i;

      x = cx + radius * Math.sin(angle);
      y = cy + radius * Math.cos(angle);

      context.save(); ////////// save the state of the context;
      context.translate(x, y); // set the cordinates to where you should rotate the context from
      context.rotate(-angle);
      context.scale(random.range(-0.5, 1.5), 1); //(x, y) adds a scaling transformation to the canvas units horizontally and/or vertically.

      context.lineWidth = random.range(0, 20);
      context.fillStyle = random.pick([
        "white",
        "#EC5787",
        "#5373FE",
        "#FFAC33",
        "#F07CA5",
        "black",
      ]);
      context.beginPath();
      context.rect(-w * 2, -h * 0.5, w, h);
      context.fill();
      context.restore(); /////////// resets the state of the context in order for the next shapes you want to transform to leverage saved state.

      // start a new arc
      context.save();
      context.translate(cx, cy);
      context.rotate(-angle);
      // context.scale(-.3, -.3)

      context.lineWidth = random.range(0, 20);
      context.beginPath();
      // arc (x, y, radius, startAngle, endAngle [, counterclockwise])
      context.strokeStyle = random.pick([
        "white",
        "#EC5787",
        "#5373FE",
        "#FFAC33",
        "#F07CA5",
        "black",
      ]);
      context.arc(
        0,
        0,
        radius * random.range(0.7, 1.3),
        0,
        random.range(slice * 0.3, slice * 5)
      ); // start angle is where the slice begins in the context of where the slice is set which is done by the translate / rotate.
      // context.arc( 0 ,0, radius, slice * -0.3, slice * 0.3) // will move our arc back along the angle
      //if context tranlate && rotate not set
      // context.arc( cx - (cx * 0.75) ,0, radius, 0, slice * 0.3 )

      // context.fill()

      context.stroke();
      context.restore();

      // start a new arc
      context.save();
      context.translate(cx, cy);
      context.rotate(-angle);
      // context.strokeStyle  = random.pick(['white','#EC5787','#5373FE','#FFAC33', '#F07CA5', 'black']);
      context.lineWidth = random.range(0, 10);
      context.beginPath();
      context.strokeStyle = random.pick([
        "white",
        "#EC5787",
        "#5373FE",
        "#FFAC33",
        "#F07CA5",
        "black",
      ]);

      // arc (x, y, radius, startAngle, endAngle [, counterclockwise])

      // context.arc( 0 ,0, radius, slice * -0.3, slice * 0.3) // will move our arc back along the angle
      //if context tranlate && rotate not set

      context.arc(cx - cx * 0.75, 0, radius, 0, slice * 0.3);

      context.stroke();
      context.restore();
    }
    // context.fillStyle= random.pick(["white", "black", "red"]);
    // context.fillRect(w*.05,-h*0.50, w* random.range(-0.5, 0.9), h* random.range(0.01,1.5 ))
    // context.fillStyle=random.pick([ "yellow", "purple"]);
    // context.fillRect(w *.05,-h*0.50, (w/8), h* random.range(0.01,0.9 ))

    // context.translate(200, 300)

    //circle
    // context.beginPath();
    // context.arc(0 , 0, 50, 0, Math.PI *2)
    // context.fill();
  };
};

const createPane = () => {
  const pane = new TweakPane.Pane();
  let folder;
  folder = pane.addFolder({ title: "Circle Sketch" });
  folder.addInput(params, "sliceNumber", { min: 1, max: 1000 });
};

createPane();

canvasSketch(sketch, settings);
