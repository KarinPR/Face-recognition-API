const handleRegister = (req, res, knex, bcrypt) => {
	const {name , email, password} = req.body
	if (!email || !name || !password) {
		return res.status(400).json('incorrect form submission' );
	}

	bcrypt.genSalt(10, function(err, salt) {
	    bcrypt.hash(password, salt, function(err, hash) {
			knex.transaction(trx => {
				trx.insert({
		    		hash: hash,
		    		email: email 
		    	})
		    	.into('login')
		    	.returning('email')
		    	.then(activeEmail => {
					return trx('users')
						.returning('*')
						.insert({
							name: name, 
							email: activeEmail[0],
							joined: new Date()
						})
						.then(user => {
							res.json(user[0]);
						})
		    	})
		    	.then(trx.commit)
		    	.catch(trx.rollback);
			}) 
			.catch(err => res.status(400).json('Unable to register'))
	    })
	})
}

module.exports = {
	handleRegister: handleRegister
};