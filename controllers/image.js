const Clarifai = require('clarifai');
const Google = require('googleapis').google;

const app = new Clarifai.App({
    apiKey: process.env.CLARIFAI_API_KEY
});

const handleAPICall = (req, res) => {
    app.models.predict(Clarifai.CELEBRITY_MODEL, req.body.input)
        .then(data => {
            res.json(data);
        })
        .catch(err => res.status(400).json('Error connecting to API.'));
}

const googleImageSearch = (req, res) => {
    Google.customsearch('v1').cse.list({
        auth: process.env.GOOGLE_API_KEY,
        cx: process.env.SEARCH_ENGINE_ID,
        q: req.body.input,
        searchType: 'image',
        num: 1
    })
    .then(data => {
        res.json(data);
    })
    .catch(err => res.status(400).json('Error connecting to Google API.'));
}

const incrementSubmittedEntries = (req, res, db) => {
    const { id } = req.body;

    db('users')
        .where('id', '=', id)
        .increment('submitted_entries', 1)
        .returning('submitted_entries')
        .then(entries => {
            res.json(entries[0]);
        })
    .catch(err => res.status(400).json('Error fetching submitted entries.'));
}

module.exports = {
    incrementSubmittedEntries,
    googleImageSearch,
    handleAPICall
}