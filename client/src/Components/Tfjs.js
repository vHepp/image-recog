import React, { useState, useEffect, useRef } from 'react';
import {createWorker} from 'tesseract.js'
import * as mobilenet from "@tensorflow-models/mobilenet";
import * as tf from '@tensorflow/tfjs'
import {ToggleButton} from '@mui/material';

const Tfjs = () => {
	//tensorflow states
	const [isModelLoading, setIsModelLoading] = useState(false)
	const [model, setModel] = useState(null)
	const [imageURL, setImageURL] = useState(null);
	const [results, setResults] = useState([])
	
	//tesseract states
	const [ocr, setOcr] = useState('Waiting to identify...');
	const [log, setLog] = useState({});
	const [textFlag, setTextFlag] = useState(false);
	const [textState, setTextState] = useState("Text Recognition Off");

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
			doOCR();
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
		logger: m => {
			console.log(m)
			setLog({
				status: m.status,
				progress: m.progress,
			});
		},
	});

	const doOCR = async () => {
		await worker.load();
		await worker.loadLanguage('eng');
		await worker.initialize('eng');
		const { data: { text } } = await worker.recognize(imageURL);
		setOcr(text);
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
							{imageURL && <img src={imageURL} alt="Upload Preview" crossOrigin="anonymous" ref={imageRef} />}
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
				<p>{ocr}</p>
				{/* <p>URL: {imageURL}</p> */}
				<progress value={log.progress} max='1' ></progress>
			</div>
		</div>
	);
}

export default Tfjs;
