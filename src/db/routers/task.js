const express = require('express');
const Task = require('../models/task');
const router = new express.Router();

router.post('/tasks', async (req, res) => {

	const task = new Task(req.body);
  
	try {
	  const createdTask = await task.save();
	  res.send(createdTask);
	} catch (error) {
	  res.status(401).send()
	}
  
  })
  
router.get('/tasks', async (req, res) => {

	try {
		const allTasks = await Task.find({});
		res.send(allTasks);
	} catch(error) {
		res.status(500).send()
	}

});


router.get('/tasks/:id', async (req, res) => {

	const _id = req.params.id;

	try {
		const task = await Task.findById(_id);
		if (!task) return res.status(404).send();
		res.send(task);

	} catch {
		res.status(404).send()
	}

})

router.patch('/tasks/:id', async (req, res) => {

	const _id = req.params.id;
	const allowedKeys = ['description', 'completed'];
	const updatedKeys = Object.keys(req.body);

	const isValidOperation = updatedKeys.every(updatedKey => allowedKeys.includes(updatedKey));

	if (!isValidOperation) res.status(400).send({error: "Invalid properties!"});

	try {
		// const updatedTask = await Task.findByIdAndUpdate(_id, req.body, {runValidators: true, new: true});
		const task = await Task.findById(_id);
		updatedKeys.forEach(updatedKey => task[updatedKey] = req.body[updatedKey]);
		const updatedTask = await task.save();

		if (!updatedTask) return res.status(404).send("Task not found");
		res.send(updatedTask);

	} catch (error) {
		console.log(error);
		return res.status(404).send(error);
	}
})

router.delete('/tasks/:id', async (req, res) => {
	try {
		const deletedTask = await Task.findByIdAndDelete(req.params.id);
		if (!deletedTask) res.status(404).send();
		res.send(deletedTask);

	} catch (error) {
		res.status(404).send(error)
	}

})


module.exports = router;