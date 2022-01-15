const canvasSketch = require("canvas-sketch");
const random = require("canvas-sketch-util/random");
const math = require("canvas-sketch-util/math");
const TweakPane = require("tweakpane");

const settings = {
  dimensions: [1080, 1080],
  animate: true,
};

// how this would happen if we didn't use the settings above for animating;
// const animate = ()=>{
//   console.log("domestick");
//   requestAnimationFrame(animate);
// }
//animate();

const params = {
  background: "rgb(0, 0, 0)",
  lineConnectDistance: 200,
  lineColor: { r: 255, g: 0, b: 176, a: 0.8 },
  selectedParticleColor: { r: 255, g: 255, b: 255, a: 1 },
  radiusMax: 30,
};

const sketch = ({ context, width, height }) => {
  const agents = [];

  for (let i = 0; i < 40; i++) {
    const x = random.range(0, width);
    const y = random.range(0, height);
    agents.push(new Agent(x, y, params));
  }

  return ({ context, width, height }) => {
    context.fillStyle = params.background;
    context.fillRect(0, 0, width, height);

    for (let i = 0; i < agents.length; i++) {
      const agent = agents[i];

      for (let j = i + 1; j < agents.length; j++) {
        const otherAgent = agents[j];
        // get the distance;
        let distance = agent.pos.getDistance(otherAgent.pos);
        //if distance is greater than 200  skip

        if (distance > params.lineConnectDistance) continue;

        context.lineWidth = math.mapRange(distance, 0, 20, 20, 0);
        //draw the line between the two;
        context.beginPath();
        context.moveTo(agent.pos.x, agent.pos.y);
        context.lineTo(otherAgent.pos.x, otherAgent.pos.y);
        context.strokeStyle = `rgba(${params.lineColor.r}, ${params.lineColor.g}, ${params.lineColor.b}, ${params.lineColor.a})`;
        context.stroke();
      }
    }
    context.strokeStyle = "black";
    agents.forEach((agent) => {
      agent.update();
      agent.draw(context, params);
      let randomNum = random.value(); //between 0 & 1

      randomNum > 0.5 ? agent.bounce(width, height) : agent.wrap(width);
    });
  };
};

const createPane = () => {
  const pane = new TweakPane.Pane();
  let folder;

  folder = pane.addFolder({ title: "Particle Connection" });
  folder.addInput(params, "background", { picker: "inline", expand: true });
  folder.addInput(params, "lineConnectDistance", {
    min: 0,
    max: 1000,
    step: 1,
  });
  folder.addInput(params, "lineColor", { picker: "inline", expand: true });
  folder.addInput(params, "selectedParticleColor", {
    picker: "inline",
    expand: true,
  });

  folder.addFolder({ title: "Particle Properties" });
  folder.addInput(params, "radiusMax", { min: 5, max: 100, step: 1 });
};

createPane();
canvasSketch(sketch, settings);

//classes are like  recipe
class Vector {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  getDistance(anotherVector) {
    const distanceX = this.x - anotherVector.x;
    const distanceY = this.y - anotherVector.y;
    return Math.sqrt(distanceX * distanceX + distanceY * distanceY); // pythagorean theorem
  }
}

class Agent {
  constructor(x, y, params) {
    this.pos = new Vector(x, y);
    this.velocity = new Vector(random.range(-2, 2), random.range(-0.5, 0.5));
    this.radius = random.range(4, params.radiusMax);
    this.wasWrapped = false;
  }

  draw(context, params) {
    context.save();
    context.translate(this.pos.x, this.pos.y);

    context.lineWidth = 4;

    context.beginPath();
    context.arc(0, 0, this.radius, 0, Math.PI * 2);
    context.fill();
    if (this.wasWrapped) {
      // console.log("here is params", params);
      context.strokeStyle = `rgba(${params.selectedParticleColor.r}, ${params.selectedParticleColor.g}, ${params.selectedParticleColor.b}, ${params.selectedParticleColor.a})`;
    }
    context.stroke();
    context.restore();
  }

  update() {
    this.pos.x += this.velocity.x;
    this.pos.y += this.velocity.y;
  }

  bounce(width, height) {
    if (this.pos.x <= 0 || this.pos.x >= width) {
      this.velocity.x *= -1;
      if (this.wasWrapped) this.wasWrapped = false;
    }
    if (this.pos.y <= 0 || this.pos.y >= height) {
      this.velocity.y *= -1;
      if (this.wasWrapped) this.wasWrapped = false;
    }
  }

  wrap(width) {
    if (this.pos.x > width) {
      this.pos.x = 0;
      this.wasWrapped = true;
    }

    if (this.pos.x < 0) {
      this.wasWrapped = true;
      this.pos.x = width;
    }
  }
}
