const express = require('express');
const cors = require('cors')

const tensorRoutes = require('./routes/tensorRoutes');

const PORT = 8000;

const server = express()
server.use(cors())

server.listen(PORT, () => {
	console.log(`Listening on port ${PORT}`)
})

/* route: http://localhost:8000/v1/api/tensor... */
server.use("/v1/api/tensor", tensorRoutes)

/* route: http://localhost:8000 */
server.get("/*", (req,res) => {
	res.status(200).send("server.js /* route")
})