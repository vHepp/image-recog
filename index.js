const tf = require('@tensorflow/tfjs-node')

console.log("Starting index.js")

const modelURL = 'file:///Users/vincent/GitHub/Repos/image-recog/Model/my_custom_model/model.json'

const model = tf.loadGraphModel(modelURL) 

const cokeAd = require('Coke_6.jpeg')

const example = tf.node.decodeJpeg(cokeAd)

//const prediction = model.execute(example)

//console.log(prediction)

