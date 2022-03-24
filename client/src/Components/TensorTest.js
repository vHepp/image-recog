import React, { useState, useEffect, useRef } from 'react';

const tf = require('@tensorflow/tfjs');
const tfvis = require('@tensorflow/tfjs-vis');
const image = require('../Images/Dogs/Dog 1.jpg');

const TensorTest = () => {
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

	tf.setBackend('webgl');
	console.log(tf.getBackend());


	return (
		<>
			<h1 style={{fontSize: '15px'}} >Hello world</h1>
			<img style={ {height: '100px', width: '100px'}} id="my-image" alt="dog1" src={image}></img>
		</>
	);
}

export default TensorTest;
