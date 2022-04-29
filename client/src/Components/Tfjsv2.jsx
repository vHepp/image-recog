import React, { useState, useEffect, useRef } from 'react';
import {createWorker, recognize} from 'tesseract.js'
import * as mobilenet from "@tensorflow-models/mobilenet";
import * as tf from '@tensorflow/tfjs'
import tfvis from '@tensorflow/tfjs-vis'
import {Button, ToggleButton} from '@mui/material';
import {loadGraphModel} from '@tensorflow/tfjs-converter';
import axios from 'axios'

require('./Styles/styles.css')

const cokeAd1 = require('../Images/Full Ads/Coke/Coke_1.jpeg')
const cokeAd2 = require('../Images/Full Ads/Coke/Coke_2.jpeg')
const cokeAd3 = require('../Images/Full Ads/Coke/Coke_3.jpeg')
const cokeAd4 = require('../Images/Full Ads/Coke/Coke_4.jpeg')
const cokeAd5 = require('../Images/Full Ads/Coke/Coke_5.jpeg')
const cokeAd6 = require('../Images/Full Ads/Coke/Coke_6.jpeg')


const adidasAd1 = require('../Images/Full Ads/Adidas/Adidas_1.jpeg')
const adidasAd2 = require('../Images/Full Ads/Adidas/Adidas_2.jpeg')
const adidasAd3 = require('../Images/Full Ads/Adidas/Adidas_3.jpeg')
const adidasAd4 = require('../Images/Full Ads/Adidas/Adidas_4.jpeg')
const adidasAd5 = require('../Images/Full Ads/Adidas/Adidas_5.png')
const adidasAd6 = require('../Images/Full Ads/Adidas/Adidas_6.jpg')
const adidasAd7 = require('../Images/Full Ads/Adidas/Adidas_7.png')
const adidasAd8 = require('../Images/Full Ads/Adidas/Adidas_8.jpg')


const nikeAd1 = require('../Images/Full Ads/Nike/Nike_1.jpg')
const nikeAd2 = require('../Images/Full Ads/Nike/Nike_2.jpg')
const nikeAd3 = require('../Images/Full Ads/Nike/Nike_3.jpg')
const nikeAd4 = require('../Images/Full Ads/Nike/Nike_4.jpg')
const nikeAd5 = require('../Images/Full Ads/Nike/Nike_5.jpg')
const nikeAd6 = require('../Images/Full Ads/Nike/Nike_6.jpg')
const nikeAd7 = require('../Images/Full Ads/Nike/Nike_7.jpg')


const pepsiAd1 = require('../Images/Full Ads/Pepsi/Pepsi_1.jpeg')
const pepsiAd2 = require('../Images/Full Ads/Pepsi/Pepsi_2.jpeg')
const pepsiAd3 = require('../Images/Full Ads/Pepsi/Pepsi_3.jpeg')
const pepsiAd4 = require('../Images/Full Ads/Pepsi/Pepsi_4.jpeg')
const pepsiAd5 = require('../Images/Full Ads/Pepsi/Pepsi_5.jpeg')
const pepsiAd6 = require('../Images/Full Ads/Pepsi/Pepsi_6.jpeg')

const testAd1 = require('../Images/Full Ads/Testing/Test_1.jpeg')
const testAd2 = require('../Images/Full Ads/Testing/Test_2.jpg')
const testAd3 = require('../Images/Full Ads/Testing/Test_3.jpeg')
const testAd4 = require('../Images/Full Ads/Testing/Test_4.jpg')
const testAd5 = require('../Images/Full Ads/Testing/Test_5.jpg')
const testAd6 = require('../Images/Full Ads/Testing/Test_6.jpg')

const MODEL_URL = 'https://raw.githubusercontent.com/vHepp/image-recog/test/Model/my_custom_model/model.json'
var children = [];

const Tfjsv2 = () => {
    //tensorflow states
	const [model, setModel] = useState(null)
	const [imageURL, setImageURL] = useState(testAd5);
	const [results, setResults] = useState(false)
	const imageFrame = document.getElementById('frame')
	
	let counts = {
		1: {
			name: 'adidas',
			count:0
		},
		2: {
			name: 'nike',
			count:0
		},
		3: {
			name: 'cocacola',
			count:0
		},
		4: {
			name: 'pepsi',
			count:0
		},
	}

	const labelMap =
	{
		1: {
			name: 'adidas',
			id: 1,
		},
		2: {
			name: 'nike',
			id: 2,
		},
		3: {
			name: 'cocacola',
			id: 3,
		},
		4: {
			name: 'pepsi',
			id: 4,
		},
	}

	const load_model = async () => {
		const model = await tf.loadGraphModel(MODEL_URL);
		
		setModel(model)
	}

	const handelLoadModel = async () => {
		console.log("Loading new JSON GraphModel")
		
		const modelPromise = load_model()

		modelPromise.then(bool => 
		{
			setResults(true)
		})		
	}

	const runModel = async () => {

		let threshold = .50; // 90% beginning confidence

		//reset counts for each logo
		for (let i = 1; i < 5; i++){
			//console.log(`reset count[${i}]`)
			counts[i].count = 0;
		}


		console.log("Running Model")

		const image = document.getElementById('pic')
		
		const imgWidth = 600;
		const imgHeight = 400;

		const tfImg = tf.browser.fromPixels(image);
		//const smallImg = tf.image.resizeBilinear(tfImg, [imgWidth,imgHeight]);
		//const resized = tf.cast(smallImg, 'int32')
		var tf4d_ = tf.tensor4d(Array.from(tfImg.dataSync()),[1,imgHeight,imgWidth,3])
		const tf4d = tf.cast(tf4d_, 'int32');

		//const imageTensor = tfImage.transpose([0,1,2]).expandDims()
		console.log(`Successful conversion from DOM to a ${tf4d.shape} tensor`)

		//tf4d.print()
		let predictions = await model.executeAsync(tf4d)
		//console.table(predictions)
		
		//renderPredictionBoxes(predictions[4].dataSync(), predictions[1].dataSync(), predictions[2].dataSync());
		/* predictions.forEach(element => {
			console.table(element)
		}); */
		
		//let data = predictions[0].dataSync()
		//console.log('Predictions', data)
		let confidences = predictions[1].dataSync()
		//console.log('Predictions', confidences)
		//data = predictions[2].dataSync()
		//console.log('Predictions', data)
		//data = predictions[3].dataSync()
		//console.log('Predictions', data)
		let logos = predictions[4].dataSync()
		//console.log('Predictions', logos)
		/* data = predictions[5].dataSync()
		console.log('Predictions', data)
		data = predictions[6].dataSync()
		console.log('Predictions', data)
		data = predictions[7].dataSync()
		console.log('Predictions', data) */


		let passing = []

		while(!passing.length && threshold > .05){
			console.log("Current confidence threshold: ", threshold)
			for(let i = 0; i < logos.length ; i++) {
				//console.log(`${i}: ${data[i]}`)
				if(confidences[i] >= threshold){
					passing.push(
						{
							label: logos[i],
							confidence: `${Math.round(confidences[i]*10000)/100}%`
						}
					)
					counts[logos[i]].count++
				}
			};

			threshold-=.05;
		}

		console.table(passing)
		console.table(counts)

		setResults(`Guess: ${labelMap[passing[0].label].name}: ${passing[0].confidence}`)
		console.log(results)
		



		tfImg.dispose();
		//smallImg.dispose();
		//resized.dispose();
		tf4d_.dispose()
		tf4d.dispose();
	}

	//Function Renders boxes around the detection:
	function renderPredictionBoxes (predictionBoxes, predictionClasses, predictionScores)
	{
		const vw = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0)
		const vh = Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0)
		var imgWidth = 600;
		var imgHeight = 500;
		var xStart = Math.floor((vw-imgWidth)/2);
		var yStart = (Math.floor((vh - imgHeight) / 2)>=0) ? (Math.floor((vh - imgHeight) / 2)):0;

		//Remove all detections:
		for (let i = 0; i < children.length; i++) {
			imageFrame.removeChild(children[i]);
		}
		children.splice(0);
		//Loop through predictions and draw them to the live view if they have a high confidence score.
		for (let i = 0; i < 99; i++) {
			//If we are over 66% sure we are sure we classified it right, draw it!
			const minY = (predictionBoxes[i * 4] * imgHeight+yStart).toFixed(0);
			const minX = (predictionBoxes[i * 4 + 1] * imgWidth+xStart).toFixed(0);
			const maxY = (predictionBoxes[i * 4 + 2] * imgHeight+yStart).toFixed(0);
			const maxX = (predictionBoxes[i * 4 + 3] * imgWidth+xStart).toFixed(0);
			const score = predictionScores[i * 3] * 100;
			const width_ = (maxX-minX).toFixed(0);
			const height_ = (maxY-minY).toFixed(0);
			//If confidence is above 70%
			if (score > 70 && score < 100){
				const highlighter = document.createElement('div');
				highlighter.setAttribute('class', 'highlighter');
				highlighter.style = 'left: ' + minX + 'px; ' +
					'top: ' + minY + 'px; ' +
					'width: ' + width_ + 'px; ' +
					'height: ' + height_ + 'px;';
				highlighter.innerHTML = '<p>'+Math.round(score) + '% ' + 'Your Object Name'+'</p>';
				imageFrame.appendChild(highlighter);
				children.push(highlighter);
			}
		}
	}




	return (
		<div className="App">
			<div className='Tensorflow'>
				<h1 className='header'>Image Data Extraction</h1>
				<div className="mainWrapper">
					<div className="mainContent">
						<div className="frame">
							<img
								style={
									{width:600,
									height: 400}
								}
								id='pic' 
								src={imageURL} 
								alt="Upload Preview"
								crossOrigin="anonymous" 
							/>
						</div>
							<div className='resultsHolder'>
								{!results ?
										<div>
											<h1>Model is not loaded</h1>
										</div>
								:
									<div>
										<h1>Model loaded!</h1>

									</div>
								}
								<h1>{results}</h1>
							{/* {results.map((result, index) => {
								return (
									<div className='result' key={result.className}>
										<span className='name'>{result.className}</span>
										<span className='confidence'>Confidence level: {(result.probability * 100).toFixed(2)}% {index === 0 && <span className='bestGuess'>Best Guess</span>}</span>
									</div>
								)
							})} */}
						</div>
					</div>
					<button style={{margin:'10px'}} className='button' onClick={handelLoadModel}>Click to Load Model</button>
					<button style={{magin:'10px'}} className='button' onClick={runModel}>Click to Run</button>
				</div>
			</div>
		</div>
	);
}

export default Tfjsv2