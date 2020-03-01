const express = require('express');
const router = new express.Router();

const User = require('../models/user');
const auth = require('../middleware/auth');


router.post('/users/login', async (req, res) => {
	try {
		const user = await User.findByCredentials(req.body.email, req.body.password);
		const token = await user.generateAuthToken();
		res.send({user: user, token});

	} catch (error) {
		res.status(400).send(error);
	}
})


router.post('/users', async (req, res) => {
	try {
		const user = new User(req.body);
		const savedUser = await user.save();
		const token = await savedUser.generateAuthToken();
		res.status(201).send({user, token});

	} catch(error) {
		res.status(400).send(error)
	}
  
})
  
router.post('/users/logout', auth, async (req, res) => {
	try {
		req.user.tokens = req.user.tokens.filter(token => {
			return token.token !== req.token;
		});

		await req.user.save();
		res.send('Successfully logged out');

	} catch (error) {
		res.status(500).send();
	}
})
  
router.post('/users/logoutAll', auth, async (req, res) => {
	try {
		const user = req.user;
		user.tokens = [];
		await user.save();

		res.status(200).send('Logged out of all sessions successfully! 🙌')

	} catch (error) {
		console.log(error);
		res.status(500).send("Something went wrong");
	}
})


router.get('/users/me', auth, async (req, res) => {
	res.send(req.user);
});


router.patch('/users/me', auth, async (req, res) => {
	
	try {
		const updatedKeys = Object.keys(req.body);
		const allowedKeys = ['name', 'email', 'password', 'age'];
		const isValidOperation = updatedKeys.every(update => allowedKeys.includes(update));
	
		if (!isValidOperation) {
			return res.status(404).send({error: 'Is not a valid operation'});
		}

		updatedKeys.forEach(updatedKey => {
			req.user[updatedKey] = req.body[updatedKey]
		})

		res.send(req.user);

	} catch (error) {
		res.status(404).send(error)
	}

})

router.delete('/users/me', auth, async (req, res) => {
	try {
		await req.user.remove();
		res.send(req.user);

	} catch (error) {
		res.status(404).send(error)
	}
})




module.exports = router;