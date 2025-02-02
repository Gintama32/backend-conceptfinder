import {ClarifaiStub, grpc} from "clarifai-nodejs-grpc";
import db from '../database.js'
import dotenv from 'dotenv'; 
dotenv.config()

const stub = ClarifaiStub.grpc();
const metadata = new grpc.Metadata();
metadata.set("authorization", `Key ${process.env.API_KEY}` );

function prediction(req, res) {
  const { url, id } = req.body;
  if (!url) {
    res.status(400).json({ error: 'Missing image URL' });
    return;
  }

  stub.PostModelOutputs(
    {
      model_id: "aaa03c23b3724a16a56b629203edc62c",
      inputs: [{ data: { image: { url } } }],
    },
    metadata,
    (err, response) => {
      if (err) {
        console.error("Error: " + err);
        res.status(500).json({ error: "Error processing request" });
        return;
      }

      if (response.status.code !== 10000) {
        console.error("Failed status: " + response.status.description);
        res.status(400).json({ error: "Failed to get predictions" });
        return;
      }

      // Extract concepts from response
      const predictions = response.outputs[0].data.concepts.map((c) => ({
        name: c.name,
        value: c.value,
      }));

      // Update entries and send JSON response with predictions and entries
      db('users')
      .where('id', '=', id)
      .increment('entries', 1)
      .returning('entries')
      .then((entries) => {
        res.json({ predictions, entries: entries[0].entries }); // Use entries[0] to send the value directly
      })
      .catch((error) => {
        console.error("Database error: " + error);
        res.status(500).json({ error: "Database error" });
      });
    
    }
  );
}

export {prediction};