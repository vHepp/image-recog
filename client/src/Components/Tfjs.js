import React, { useState, useEffect, useRef } from 'react';
import {createWorker} from 'tesseract.js'
import * as tf from '@tensorflow/tfjs'
import {Button, ToggleButton} from '@mui/material';
import axios from 'axios'

const MODEL_URL = 'https://raw.githubusercontent.com/vHepp/image-recog/test/Model/my_custom_model/model.json'

const Tfjs = () => {

	//tensorflow states
	const [isModelLoading, setIsModelLoading] = useState(false)
	const [model, setModel] = useState(null)
	const [imageURL, setImageURL] = useState(null);
	const [results, setResults] = useState([])
	const imageFrame = document.getElementById('frame')

	let labelMap = {
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

	//tesseract states
	const [ocr, setOcr] = useState('');
	const [textFlag, setTextFlag] = useState(false);
	const [textState, setTextState] = useState("Text Recognition Off");

	const imageRef = useRef()
	const textInputRef = useRef()
	const fileInputRef = useRef()

	/* ------ Tensorflow Stuff ------ */
	const loadModel = async () => {
		console.log("Loading new JSON GraphModel")
		setIsModelLoading(true)
		try {
			const model = await tf.loadGraphModel(MODEL_URL)
			setModel(model)
			setIsModelLoading(false)
		} catch (error) {
			console.log(error)
			setIsModelLoading(false)
		}
	}

	const uploadImage = (e) => {
		const { files } = e.target
		if (files.length > 0) {
			const url = URL.createObjectURL(files[0])
			setImageURL(url)
		} else {
			setImageURL(null)
		}
	}

	const runModel = async () => {

		let threshold = .50; // 90% beginning confidence

		//reset counts for each logo
		for (let i = 1; i < 5; i++){
			//console.log(`reset count[${i}]`)
			labelMap[i].count = 0;
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
					labelMap[logos[i]].count++
				}
			};

			threshold-=.05;
		}

		console.table(passing)
		console.table(labelMap)

		setResults(`Guess: ${labelMap[passing[0].label].name}: ${passing[0].confidence}`)
		console.log(results)
		



		tfImg.dispose();
		//smallImg.dispose();
		//resized.dispose();
		tf4d_.dispose()
		tf4d.dispose();
	}

	const identify = async () => {
		if(textFlag){
			setOcr("Scanning text...")
			doOCR();
			setResults([])
		}
		else{
			runModel()
			setOcr('')
		}
		textInputRef.current.value = ''
	}

	const handleOnChange = (e) => {
		setImageURL(e.target.value)
		setResults([])
	}
	
	const triggerUpload = () => {
		fileInputRef.current.click()
	}

	/* ------ Tesseract Stuff ----- */
	const worker = createWorker();

	const doOCR = async () => {
		await worker.load();
		await worker.loadLanguage('eng');
		await worker.initialize('eng');
		await worker.setParameters({
			tessedit_pageseg_mode: '3',
		})
		const { data: { text } } = await worker.recognize(imageURL);
		console.log(text);
		setOcr(text);
		await worker.terminate();
	};

	const handleWrite = () => {

		axios.post('http://localhost:5000/writeLog', {text: `${ocr}`})
		.then((response) => {
			if (response.status === 200){
				console.log(response.data)
			} else if (response.status === 500){
				console.log(`Write Error: ${response.data}`)
			} else {
				console.log(`Unknown Error: ${response.data}`)
			}
		}).catch((err => {
			console.log(err)
		}))
		
	}

	const toggleOCR = () => {
		if (textFlag){
			setTextFlag(false);
			setOcr("")
			setTextState("Text Recognition Off")
		}
		else{
			setTextFlag(true);
			setOcr('OCR On. Waiting to identify...')
			setTextState("Text Recognition On")
		}
	}

	useEffect(() => {
		loadModel()
	}, [])

	if (isModelLoading) {
		return <h2>Please wait the Model is Loading...</h2>
	}

	return (
		<div className="App">
			<div className='Tensorflow'>
				<h1 className='header'>Image Data Extraction</h1>
				<div className='inputHolder'>
					<input style={{margin: '10px'}} type='file' accept='image/*' capture='camera' className='uploadInput' onChange={uploadImage} ref={fileInputRef} />
					<button  className='uploadImage' style={{margin: '10px'}} ref={textInputRef} onChange={handleOnChange} onClick={triggerUpload}>Please Upload an Image</button>
				</div>
				<div className="mainWrapper">
					<div className="mainContent">
						<div className="imageHolder" style={{ margin:'10px',   width:600, height:400}}>
							{imageURL && <img id='pic' src={imageURL} style={{width:600, height:400}} alt="Upload Preview" crossOrigin="anonymous" ref={imageRef} />}
						</div>
						<div className='resultsHolder'>
							{!results ?
									<div>
										<h1 style={{margin: '10px'}}>Model is not loaded</h1>
									</div>
							:
								<div>
									<h1 style={{margin: '10px'}}>{results}</h1>
								</div>
							}
							{/* Commented becuase it may be useful when tracking multiple possible brands
								{results.map((result, index) => {
								return (
									<div className='result' key={result.className}>
										<span className='name'>{result.className}</span>
										<span className='confidence'>Confidence level: {(result.probability * 100).toFixed(2)}% {index === 0 && <span className='bestGuess'>Best Guess</span>}</span>
									</div>
								)
							})}
							*/}
						</div>
					</div>
					{imageURL && <button style={{margin: '10px'}} className='button' onClick={identify}>Click to Identify the Image</button>}
				</div>
			</div>
			<div className='Tesseract'>
				{imageURL &&
					<>
						<ToggleButton style={{margin: '10px'}} value="Text Recognition" onClick={toggleOCR}>{textState}</ToggleButton>
						<h3 style={{margin: '10px'}}>{ocr}</h3>
					</>
				}
				
				{textFlag &&
					imageURL &&
					<Button style={{ backgroundColor:'blueviolet', color:'white', margin: '10px'}} onClick={handleWrite}  >Write to log.txt</Button>
				}
				{/* Commented for possible fix to progress bar
					<progress style={{margin: '10px'}} value={log.progress} max='1' ></progress>
				*/}
			</div>
		</div>
	);
}

export default Tfjs;