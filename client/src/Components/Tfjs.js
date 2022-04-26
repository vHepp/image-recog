import React, { useState, useEffect, useRef } from 'react';
import {createWorker} from 'tesseract.js'
import * as mobilenet from "@tensorflow-models/mobilenet";
import * as tf from '@tensorflow/tfjs'
import {Button, ToggleButton} from '@mui/material';
import axios from 'axios'


const Tfjs = () => {

	//tensorflow states
	const [isModelLoading, setIsModelLoading] = useState(false)
	const [model, setModel] = useState(null)
	
	const [imageURL, setImageURL] = useState(null);
	const [results, setResults] = useState([])
	
	//tesseract states
	const [ocr, setOcr] = useState('Waiting to identify...');
	const [log, setLog] = useState({});
	const [textFlag, setTextFlag] = useState(true);
	const [textState, setTextState] = useState("Text Recognition On");

	const imageRef = useRef()
	const textInputRef = useRef()
	const fileInputRef = useRef()
	/* ------ Tensorflow Stuff ------ */
	const loadModel = async () => {
		setIsModelLoading(true)
		try {
			const model = await mobilenet.load()
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

	const identify = async () => {
		if(textFlag){
			await doOCR()
			.catch((err) => {
				console.log(err)
			});
		}
		else{
			setOcr('')
		}
		textInputRef.current.value = ''
		const results = await model.classify(imageRef.current)
		setResults(results)
	}

	const handleOnChange = (e) => {
		setImageURL(e.target.value)
		setResults([])
	}

	const triggerUpload = () => {
		fileInputRef.current.click()
	}

	/* ------ Tesseract Stuff ----- */
	const worker = createWorker({
		//adding logger options causes the worker to crash for some reason...
		/* 				
		logger: m => {
			console.log(m)
			setLog({
				status: m.status,
				progress: m.progress,
			});
		}, */
	})

	const doOCR = async () => {
		await worker.load();
		await worker.loadLanguage('eng');
		await worker.initialize('eng');
		await worker.setParameters({
			tessedit_pageseg_mode: '3',
		})
		const { data: { text } } = await worker.recognize(imageURL, {
			
		});
		console.log(text);
		setOcr(text);
		await worker.terminate();
	};

	const toggleOCR = () => {
		if (textFlag){
			setTextFlag(false);
			setOcr("")
			setTextState("Text Recognition Off")
		}
		else{
			setTextFlag(true);
			setOcr('Waiting to identify...')
			setTextState("Text Recognition On")
		}
	}

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

	/*//Download the log file, NOT! WORKING !
	const handleDownload = () => {

		axios.get('http://localhost:5000/downloadLog')
		.then((response) => {
			if (response.status === 200){
				console.log(response.data)
			} else if (response.status === 500){
				console.log(`download Error: ${response.data}`)
			} else {
				console.log(`Unknown Error: ${response.data}`)
			}
		}).catch((err => {
			console.log(err)
		}))
		
	} */

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
					<input type='file' accept='image/*' capture='camera' className='uploadInput' onChange={uploadImage} ref={fileInputRef} />
					<button className='uploadImage' ref={textInputRef} onChange={handleOnChange} onClick={triggerUpload}>Please Upload an Image</button>
					{/* <span className='or'>OR</span> */}
					{/* <input type="text" placeholder='Paste image URL' ref={textInputRef} onChange={handleOnChange} /> */} 
				</div>
				<div className="mainWrapper">
					<div className="mainContent">
						<div className="imageHolder">
							{imageURL && <img src={imageURL} style={{margin: '10px'}} alt="Upload Preview" crossOrigin="anonymous" ref={imageRef} />}
						</div>
						{results.length > 0 && <div className='resultsHolder'>
							{results.map((result, index) => {
								return (
									<div className='result' key={result.className}>
										<span className='name'>{result.className}</span>
										<span className='confidence'>Confidence level: {(result.probability * 100).toFixed(2)}% {index === 0 && <span className='bestGuess'>Best Guess</span>}</span>
									</div>
								)
							})}
						</div>}
					</div>
					{imageURL && <button className='button' onClick={identify}>Click to Identify the Image</button>}
				</div>
			</div>
			<div className='Tesseract'>
				<ToggleButton style={{margin: '10px'}} value="Text Recognition" onClick={toggleOCR}>{textState}</ToggleButton>
				<h3 style={{margin: '10px'}}>{ocr}</h3>
				{/* <p>URL: {imageURL}</p> */}
				<progress style={{margin: '10px'}} value={log.progress} max='1' ></progress>
			</div>
			<Button style={{ backgroundColor:'blueviolet', color:'white', margin: '10px'}} onClick={handleWrite}  >Write to log.txt</Button>
			{/* <Button style={{ backgroundColor:'blueviolet', color:'white', margin: '10px'}} onClick={handleDownload}  >Download Text Log</Button> */}
		</div>
	);
}

export default Tfjs;
