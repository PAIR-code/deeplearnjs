/* Copyright 2017 Google Inc. All Rights Reserved.
Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
==============================================================================*/
import {NDArray, NDArrayMathGPU} from 'deeplearn';
import Vue from 'vue';

import DemoFooter from '../footer.vue';
import DemoHeader from '../header.vue';
import Graph from './Graph.vue';

import {GameOfLife, GameOfLifeModel} from './game_of_life';

const data = {
  boardSize: 5,
  trainingSize: 2000,
  trainingBatchSize: 5,
  learningRate: 1.0,
  numLayers: 3,
  updateInterval: 25,
  useLogCost: true,
  running: false
};

// /** Shows model training information. */
class TrainDisplay {
  element: Element;
  trainingDataElement: Element;
  canvas: CanvasRenderingContext2D;
  chart: Chart;
  chartData: [ChartData[]];
  chartDataIndex = -1;

  datasets: ChartDataSets[] = [];

  setup(): void {
    this.element = document.querySelector('.train-display');
    this.trainingDataElement = document.querySelector('.data-display');
    // TODO(kreeger): switch to Vue-component for rendering charts?
    this.canvas = (document.getElementById('myChart') as HTMLCanvasElement)
                      .getContext('2d');
    this.chart = new Chart(this.canvas, {
      type: 'line',
      data: {
        datasets: this.datasets,
      },
      options: {
        animation: {duration: 0},
        responsive: false,
        scales: {
          xAxes: [{type: 'linear', position: 'bottom'}],
          // yAxes: [{ticks: {beginAtZero: true}}]
        }
      }
    });
  }

  addDataSet(): void {
    if (!this.chartData) {
      this.chartData = [[]];
    } else {
      this.chartData.push([]);
    }
    this.datasets.push({
      data: this.chartData[++this.chartDataIndex],
      fill: false,
      label: 'Cost ' + (this.chartDataIndex + 1),
      pointRadius: 0,
      borderColor: this.randomRGBA(),
      borderWidth: 1,
      lineTension: 0,
      pointHitRadius: 8
    });
  }

  showStep(step: number, steps: number) {
    this.element.innerHTML = 'Trained ' + Math.trunc(step / steps * 100) + '%';
  }

  displayCost(cost: number, step: number) {
    this.chartData[this.chartDataIndex].push({x: step, y: cost});
    this.chart.update();
  }

  displayTrainingData(length: number, size: number) {
    this.trainingDataElement.innerHTML =
        ' - (Building training data - ' + length + ' of ' + size + ')';
  }

  clearTrainingData(): void { this.trainingDataElement.innerHTML = ''; }

  private randomRGBA(): string {
    const s = 255;
    return 'rgba(' + Math.round(Math.random() * s) + ',' +
        Math.round(Math.random() * s) + ',' + Math.round(Math.random() * s) +
        ',1)';
  }
}

/* Draws Game Of Life sequences */
class WorldDisplay {
  rootElement: Element;

  constructor() {
    this.rootElement = document.createElement('div');
    this.rootElement.setAttribute('class', 'world-display');

    document.querySelector('.worlds-display').appendChild(this.rootElement);
  }

  displayWorld(world: NDArray, title: string): Element {
    const worldElement = document.createElement('div');
    worldElement.setAttribute('class', 'world');

    const titleElement = document.createElement('div');
    titleElement.setAttribute('class', 'title');
    titleElement.innerText = title;
    worldElement.appendChild(titleElement);

    const boardElement = document.createElement('div');
    boardElement.setAttribute('class', 'board');

    for (let i = 0; i < world.shape[0]; i++) {
      const rowElement = document.createElement('div');
      rowElement.setAttribute('class', 'row');

      for (let j = 0; j < world.shape[1]; j++) {
        const columnElement = document.createElement('div');
        columnElement.setAttribute('class', 'column');
        if (world.get(i, j) === 1) {
          columnElement.classList.add('alive');
        } else {
          columnElement.classList.add('dead');
        }
        rowElement.appendChild(columnElement);
      }
      boardElement.appendChild(rowElement);
    }

    worldElement.appendChild(boardElement);
    this.rootElement.appendChild(worldElement);
    return worldElement;
  }
}

/** Manages displaying a list of world sequences (current, next, prediction) */
class WorldContext {
  world: NDArray;
  worldNext: NDArray;
  worldDisplay: WorldDisplay;
  predictionElement: Element = null;

  constructor(worlds: [NDArray, NDArray]) {
    this.worldDisplay = new WorldDisplay();

    this.world = worlds[0];
    this.worldNext = worlds[1];
    this.worldDisplay.displayWorld(this.world, 'Sequence');
    this.worldDisplay.displayWorld(this.worldNext, 'Next Sequence');
  }

  displayPrediction(prediction: NDArray) {
    if (this.predictionElement) {
      this.predictionElement.remove();
    }
    this.predictionElement =
        this.worldDisplay.displayWorld(prediction, 'Prediction');
  }
}

const math = new NDArrayMathGPU();
const game = new GameOfLife(5, math);
const model = new GameOfLifeModel(math);

let trainingData: Array<[NDArray, NDArray]> = [];
const worldContexts: WorldContext[] = [];

const trainDisplay = new TrainDisplay();

let step = 0;
let trainingSteps = 100;
let trainingBatchSize = 5;

let isBuildingTrainingData = true;

async function trainAndRender() {
  if (step === trainingSteps) {
    data.running = false;
    return;
  }

  requestAnimationFrame(() => trainAndRender());

  if (isBuildingTrainingData) {
    math.scope(async() => {
      // Do 2 examples each pass:
      trainingData.push(await game.generateGolExample());
      if (trainingData.length < trainingBatchSize) {
        trainingData.push(await game.generateGolExample());
      }
    });

    if (trainingBatchSize >= 20) {
      trainDisplay.displayTrainingData(
          trainingData.length + 1, trainingBatchSize);
    }
    if (trainingData.length === trainingBatchSize) {
      isBuildingTrainingData = false;
      trainDisplay.clearTrainingData();
    }
  }

  if (!isBuildingTrainingData) {
    step++;
    const fetchCost = step % data.updateInterval === 0;
    const cost = model.trainBatch(fetchCost, trainingData);

    if (fetchCost) {
      trainDisplay.showStep(step, trainingSteps);
      trainDisplay.displayCost(cost, step);

      worldContexts.forEach((worldContext) => {
        worldContext.displayPrediction(model.predict(worldContext.world));
      });
    }

    trainingData = [];
    isBuildingTrainingData = true;
  }
}

// tslint:disable-next-line:no-default-export
export default Vue.extend({
  data() { return data; },
  components: {DemoHeader, DemoFooter, Graph},
  methods: {
    onAddSequenceClicked: async() => {
      console.log('clicked');
      console.log('train clicked', trainDisplay);
      console.log(data.boardSize);
      worldContexts.push(new WorldContext(await game.generateGolExample()));
    },

    onTrainModelClicked: async() => {
      game.setSize(data.boardSize);
      model.setupSession(
          data.boardSize, data.trainingBatchSize, data.learningRate,
          data.numLayers, data.useLogCost);

      step = 0;
      trainingSteps = data.trainingSize;
      trainingBatchSize = data.trainingBatchSize;
      trainingData = [];
      trainDisplay.addDataSet();

      data.running = true;

      trainAndRender();
    }
  },
  mounted: async() => {
    for (let i = 0; i < 5; i++) {
      worldContexts.push(new WorldContext(await game.generateGolExample()));
    }
    trainDisplay.setup();
  }
});

//   private static clearChildNodes(node: Element) {
//     while (node.hasChildNodes()) {
//       node.removeChild(node.lastChild);
//     }
//   }
// }
