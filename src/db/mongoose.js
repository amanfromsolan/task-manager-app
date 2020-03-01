const mongoose = require('mongoose');

const databaseName = 'task-manager-api'
const connectionURL = 'mongodb://127.0.0.1:27017/' + databaseName;

mongoose.connect(connectionURL, {
	useNewUrlParser: true,
	useUnifiedTopology: true,
	useCreateIndex: true
});

