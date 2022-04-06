import React, { useState, useEffect, useRef } from 'react';

const tf = require('@tensorflow/tfjs');


const TensorTest = () => {

	/* const [images, setImages] = useState([
		image1,
		image2,
		image3,
	])

	const filenames = tf.constant(['im_01.jpg', 'im_02.jpg', 'im_03.jpg', 'im_04.jpg']);
	const labels = tf.constant([0, 1, 0, 1])

	dataset = tf.data.Dataset.from_tensor_slices((filenames, labels))

	const _parse_function = (filename, label) => {
		image_string = tf.read_file(filename)
		image_decoded = tf.image.decode_jpeg(image_string, channels=3)
		image = tf.cast(image_decoded, tf.float32)
		return image, label
	}

	dataset = dataset.map(_parse_function)
	dataset = dataset.batch(2)

	iterator = dataset.make_one_shot_iterator()
	images, labels = iterator.get_next()
 */
	/* const model = tf.sequential({
		layers: [
			tf.layers.dense({})
		]
	}) */

	/* 
	// Create a rank-2 tensor (matrix) matrix tensor from a multidimensional array.
	const a = tf.tensor([[1, 2], [3, 4]]);
	a.print();

	// Or you can create a tensor from a flat array and specify a shape.
	const shape = [2, 2];
	const b = tf.tensor([1, 2, 3, 4], shape);
	b.print(); */

	/* tf.browser.fromPixels(image).print(); */

	let model = tf.sequential({
		layers: [
			tf.layers.dense({inputShape: [784], units: 32, activation: 'relu'}),
			tf.layers.dense({units: 10, activation: 'softmax'}),
		]
	});

	model.compile({
		optimizer: 'sgd',
		loss: 'categoricalCrossentropy',
		metrics: ['accuracy']
	});
	
	// Generate dummy data.
	const data = tf.randomNormal([100, 784]);
	const labels = tf.randomUniform([100, 10]);

	function onBatchEnd(batch, logs) {
		console.log('Accuracy', logs.acc);
	}

	// Train for 5 epochs with batch size of 32.
	model.fit(data, labels, {
		epochs: 5,
		batchSize: 32,
		callbacks: {onBatchEnd}
	}).then(info => {
		console.log('Final accuracy', info.history.acc);
	});

	// Predict 3 random samples.
	const prediction = model.predict(tf.randomNormal([3, 784]));
	prediction.print();


	/* model.summary();
	model.weights.forEach(w => {
		console.log(w.name, w.shape);
	}); */
	
	const saveModel = () => {
		model.save('downloads://my-model-1');
	}
	/* const loadModel = () => {
		//this is for node
		model = tf.loadLayersModel('file:///Users/vincent/GitHub/Repos/image-recog/client/src/Models/my-model-1.json')
	} */
	return (
		<>
			<React.Fragment>
				<h1 style={{fontSize: '15px'}} >Hello world</h1>
{/* 				{images.map((m, i ) => 
					<img style={{width: '70px', height:'50px'}} key={i} src={m} alt="" />
				)} */}

				<button style={{margin: '10px' }} onClick={saveModel}>Download Model</button>
				{/* <button onClick={loadModel}>Load Model</button> */}
			</React.Fragment>
		</>
	);
}

export default TensorTest;
