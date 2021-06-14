const Clarifai = require('clarifai');

const app = new Clarifai.App({
	apiKey: process.env.CLARIFAI_API_KEY,
});

const handleAPICall = (req, res) => {
  app.models
    .predict(Clarifai.FACE_DETECT_MODEL, req.body.input)
    .then((data) => res.json(data))
	.catch(err => res.status(400).json("unable to work with API"));
};

const handleImage = db => (req, res) => {
  const { id } = req.body;

  db("users")
    .where("id", "=", id)
    .increment("entries", 1)
    .returning("entries")
    .then(([entries]) => res.json(entries))
    .catch((err) => res.status(400).json("Something went wrong!"));
}

module.exports = {
	handleImage,
	handleAPICall
}