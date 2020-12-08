let shapeClassifier;
let canvas;
let resultsDiv;
let inputImage;
let video;
let numtrack = 1;
let maskon;

function setup() {
  canvas = createCanvas(450, 450);
  video = createCapture(VIDEO);
  video.size(64, 64);
  let options = {
		inputs: [64, 64, 4],
		task: 'imageClassification',
  };
  shapeClassifier = ml5.neuralNetwork(options);
  
  const modelDetails = {
    model: 'model/model.json',
    metadata: 'model/model_meta.json',
    weights: 'model/model.weights.bin'
    
  }
  background(255);
  resultsDiv = createDiv('loading model');
  inputImage = createGraphics(64, 64);
  shapeClassifier.load(modelDetails, modelLoaded)

}

function classifyImage() {
  shapeClassifier.classify({image: video}, gotResults);
}

function gotResults(err, results) {
  if(err) {
    console.error(err);
    return;
  }
  
  let label = results[0].label;
  let confidence = nf(100* results[0].confidence, 2, 0);
  
  if(results[0].label == 'no mask'){
    resultsDiv.html(`No mask detected: ${confidence}% Confidence`);
    stroke(255, 50, 50);
    strokeWeight(10);
    rect(0, 450, 450, 20);
    rect(450, 0, 20, 450);
  } else {
    resultsDiv.html(`Mask detected: ${confidence}% Confidence`);
    stroke(80, 170, 255);
    strokeWeight(10);
    rect(0, 450, 450, 30);
    rect(450, 0, 30, 450);
  }

  classifyImage();
}

function modelLoaded() {
  console.log('model loaded');
  classifyImage();
}

function draw() {
  image(video, 0, 0, width-10, height-10);
}