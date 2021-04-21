const formSubmissionIsValid = (email, password) => email != '' && password != ''

const handleLogin = (req, res, db, bcrypt) => {
    const { email, password } = req.body;
    if (!formSubmissionIsValid(email, password)) {
        return res.status(400).json('Invalid form submission.');
    }

    db.select('email', 'hash')
        .from('login')
        .where('email', '=', req.body.email)
        .then(data => {
            const passwordMatched = bcrypt.compareSync(req.body.password, data[0].hash);
            if (passwordMatched) {
                return db.select('*')
                    .from('users')
                    .where('email', '=', req.body.email)
                    .then(user => {
                        res.json(user[0])
                    })
                    .catch(err => res.status(400).json('Login failed. Please try again.'))
            } else {
                res(err => res.status(400).json('No matching login credentials found. Please try again.'))
            }
        })
    .catch(err => res.status(400).json('No matching login credentials found. Please try again.'))
}

module.exports = {
    handleLogin: handleLogin
}