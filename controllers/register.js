const formSubmissionIsValid = (email, username, password) => email != '' && username != '' && password != ''

const handleRegister = (req, res, db, bcrypt) => {
    const { email, username, password } = req.body;
    if(!formSubmissionIsValid(email, username, password)) {
        return res.status(400).json('Invalid form submission.');
    }

    const hash = bcrypt.hashSync(password);

    db.transaction(trx => {
        trx.insert({
            hash: hash,
            email: email
        })
            .into('login')
            .returning('email')
            .then(loginEmail => {
                return trx('users')
                    .returning('*')
                    .insert({
                        email: loginEmail[0],
                        username: username,
                        join_date: new Date()
                    })
                    .then(user => {
                        res.json(user[0]);
                    })
            })
            .then(trx.commit)
            .catch(trx.rollback)
    })
    .catch(err => res.status(400).json('Unable to register. Please try again.'))
}

module.exports = {
    handleRegister: handleRegister
};