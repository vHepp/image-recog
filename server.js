const express = require('express')
const cors = require('cors')
const fs = require('fs')
const path = require('path');
const http = require('http'); // or 'https' for https:// URLs


const PORT = 5000;

const server = express()

server.use(cors())
server.use(express.urlencoded({extended: true}))
server.use(express.json())


server.listen(PORT, () => {
	console.log(`Server listening on port ${PORT}`)
})

const logFilePath = './log.txt' 

// http://localhost:5000/writeLog
server.post('/writeLog', (req, res) => {
	
	const data = req.body.text
	console.log(data)
	
	fs.writeFileSync(logFilePath, data, (err) => {
		if(err){
			console.log(err)
			res.status(500).send('Failed to write')
		}
		else{
			console.log("The written has the following contents:");
			console.log(fs.readFileSync(logFilePath, "utf8"));
			res.status(200).send("Write Successful")
		}
	})
	
	
})

// http://localhost:5000/downloadLog
server.get('/downloadLog', (req, res) => {

	res.download(logFilePath, (err) => {
		if(err){
			res.status(500).send("Error!!!!")
		}else{
			console.log('Downloading Log...')

		}
	})
	
	
})


// http://localhost:5000/
server.get('/*', (req, res) => {
	
	res.send("wildcard /*")
})

