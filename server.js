const tf = require("@tensorflow/tfjs-node")

console.log('STARTING')

//const source = 'file:///Users/vincent/GitHub/Repos/image-recog/train/_annotations.csv'
const source = 'https://storage.googleapis.com/tfjs-examples/multivariate-linear-regression/data/boston-housing-train.csv';

const run = async () => {
	const csvDataset = tf.data.csv(source, {
		columnConfigs: {
		  medv: {
			isLabel: true
		  }
		}
	});
	
	
	// Number of features is the number of column names minus one for the label
    // column.
    const numOfFeatures = (await csvDataset.columnNames()).length - 1;

	// Prepare the Dataset for training.
	const flattenedDataset = csvDataset.map(({xs, ys}) =>
	{
		newXY = {xs:Object.values(xs), ys:Object.values(ys)}
		
		// Convert xs(features) and ys(labels) from object form (keyed by
		// column name) to array form.
		return newXY;
	})
	.batch(10);

	// Define the model.
	const model = tf.sequential();
	model.add(tf.layers.dense({
		inputShape: [numOfFeatures],
		units: 1
	}));

	model.compile({
		optimizer: tf.train.sgd(0.000001),
		loss: 'meanSquaredError'
	});
	///*
	
	// Fit the model using the prepared Dataset
	return model.fitDataset(flattenedDataset, {
		epochs: 500,
		callbacks: {
			onEpochEnd: async (epoch, logs) => {
				console.log(epoch + ':' + logs.loss);
		  	}
		}
	}); 
	//*/
}

run();