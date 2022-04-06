import React, {useState, useEffect} from 'react'
import {createWorker} from 'tesseract.js'
import img1 from '../Images/sample1.png'

const Tesseract = () => {
	const worker = createWorker({
	  logger: m => console.log(m),
	});
	const doOCR = async () => {
	  await worker.load();
	  await worker.loadLanguage('eng');
	  await worker.initialize('eng');
	  const { data: { text } } = await worker.recognize(img1);
	  setOcr(text);
	};
	const [ocr, setOcr] = useState('Recognizing...');
	useEffect(() => {
	  doOCR();
	});
	return (
	  <div className="App">
		<p>{ocr}</p>
	  </div>
	);
  }

export default Tesseract