const handleSignin = (req, res, knex, bcrypt) => {
	const { email, password } = req.body

	if (!email || !password) {
		return res.status(400).json('incorrect form submission' );
	}

	knex.select('email', 'hash').from('login')
		.where({
			email: email
		})
		.then(info => {
			bcrypt.compare(password, info[0].hash)
				.then((bool) => {
					if (bool) {
						return knex.select('*').from('users')
							.where({
								email: email
							})
							.then( user => {
								res.json(user[0])
							})
							.catch(err => res.status(400).json('Unable to login'))
					} else {
						res.status(400).json('Something is wrong')
					}
				})
				.catch(err => res.status(400).json('Something is wrong'))
		})
}

module.exports = {
	handleSignin: handleSignin
};