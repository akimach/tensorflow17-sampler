import * as tf from '@tensorflow/tfjs';
import * as tfc from '@tensorflow/tfjs-core';
import {loadFrozenModel} from '@tensorflow/tfjs-converter';

export default class Predictor {

  constructor(){
  	this.model = null;
  }

  async load(model_url, weights_url) {
    try {
      this.model = await loadFrozenModel(model_url, weights_url);
    } catch (e) {
      console.log(e);
    }
  }

  async predict(pixels) {
    return tf.tidy(() => {
      const xs = tf.tensor2d([pixels]);
      return this.model.execute({x: xs})
    }).dataSync();
  }
}
