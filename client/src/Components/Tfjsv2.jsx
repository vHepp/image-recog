import React, { useState, useEffect, useRef } from 'react';
import {createWorker} from 'tesseract.js'
import * as mobilenet from "@tensorflow-models/mobilenet";
import * as tf from '@tensorflow/tfjs'
import {Button, ToggleButton} from '@mui/material';
import {loadGraphModel} from '@tensorflow/tfjs-converter';
import axios from 'axios'

const cokeAd = require('../Images/Full Ads/Coke_6.jpeg')

const MODEL_URL = '/my_custom_model/model.json'


const Tfjsv2 = () => {
  //tensorflow states
	const [model, setModel] = useState(null)
	const [imageURL, setImageURL] = useState(cokeAd);
	const [results, setResults] = useState([])


	/* ------ Tensorflow Stuff ------ */
	/* const loadModel = async () => {
		setIsModelLoading(true)
		try {
			const model = await mobilenet.load()
			setModel(model)
			setIsModelLoading(false)
		} catch (error) {
			console.log(error)
			setIsModelLoading(false)
		}
	} */

	/* const uploadImage = (e) => {
		const { files } = e.target
		if (files.length > 0) {
			const url = URL.createObjectURL(files[0])
			setImageURL(url)
		} else {
			setImageURL(null)
		}
	} */
	
	/* const handleOnChange = (e) => {
		setImageURL(e.target.value)
		setResults([])
	} */

	const handelLoadModel = async () => {
		console.log("Loading new JSON GraphModel")
		

		/* const model = loadGraphModel(MODEL_URL);
		const pic = document.getElementById('pic');
		model.execute(tf.browser.fromPixels(pic)); */
		
		axios.get("http://localhost:8000/v1/api/tensor/model/getPredictions")
		.then((response) => {
			console.log(response.data)

			/* const model  = response.data;
			const zeros = tf.zeros([1, 224, 224, 3]);
			//const model = tf.loadLayersModel()
			console.log("Loaded model")
			//setModel(model)
			model.predict(zeros).print() */

		})
		.catch((err) => {
			console.log(err)
		})


		
	} 



	return (
		<div className="App">
			<div className='Tensorflow'>
				<h1 className='header'>Image Data Extraction</h1>
				<div className="mainWrapper">
					<div className="mainContent">
						<div className="imageHolder">
							<img id='pic' src={imageURL} alt="Upload Preview" crossOrigin="anonymous" />
						</div>
							<div className='resultsHolder'>
							{results.map((result, index) => {
								return (
									<div className='result' key={result.className}>
										<span className='name'>{result.className}</span>
										<span className='confidence'>Confidence level: {(result.probability * 100).toFixed(2)}% {index === 0 && <span className='bestGuess'>Best Guess</span>}</span>
									</div>
								)
							})}
						</div>
					</div>
					<button className='button' onClick={handelLoadModel}>Click to Identify the Image</button>
				</div>
			</div>
		</div>
	);
}

export default Tfjsv2