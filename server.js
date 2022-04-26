const express = require('express') // import express library
const cors = require('cors') // cors - cross origin resource sharing, allows frontend to request from the backend 
const fs = require('fs') // modejs file system library for interacting with local storage

const PORT = 5000; // The network port the server will run on

// Create an express server
const server = express()

// configure the server to use CORS and other common-practice options
server.use(cors())
server.use(express.urlencoded({extended: true}))
server.use(express.json())

// Start the server on the chosen port
server.listen(PORT, () => {
	console.log(`Server listening on port ${PORT}`)
})

// the path to the log.txt file
const logFilePath = './log.txt' 

// Will run if the client uses a POST request with this URL route
// http://localhost:5000/writeLog
server.post('/writeLog', (req, res) => {
	
	//retrieve the desired text from the request body
	const data = req.body.text
	//print to console to verify it's integrity
	console.log(data)
	
	// attempt to write to log.txt
	fs.writeFileSync(logFilePath, data, (err) => {
		if(err){
			// output the error (if there is one)
			console.log(err)
			// send a failed response back to the client, status of 500 
			res.status(500).send('Failed to write')
		}
		else{
			console.log("The written has the following contents:");
			// read back from the file and print to console
			console.log(fs.readFileSync(logFilePath, "utf8"));
			// send a successful response back to the client, status of 200
			res.status(200).send("Write Successful")
		}
	})
	
	
})

// http://localhost:5000/downloadLog
// Unused by the client, but works if you go to the URL directly in the browser
server.get('/downloadLog', (req, res) => {
	
	// attempt to download the log file from the given path
	res.download(logFilePath, (err) => {
		if(err){
			
			// send a failed response back to the client, status of 500 
			res.status(500).send("Error!!!!")
		}else{
			// send a successful response back to the client, status of 200 
			console.log('Downloading Log...')
		}
	})
})

// http://localhost:5000/loadModel
// send the model.json to the frontend, doesn't work with frontend tensorflowjs. Needs more research
server.get('/loadModel', (req, res) => {
	const myModelPath = '/myModel/model.json'
	
	//fs.readFileSync(myModelPath, 'utf-8')
	res.sendFile(__dirname + myModelPath)
})

// a catch-all server route if an undefined route it followed
// http://localhost:5000/
server.get('/*', (req, res) => {
	
	res.send("wildcard /*")
})

