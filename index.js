import express from "express";
import cors from "cors";
import mongodb from "mongodb";
import dotenv from "dotenv";
dotenv.config();

const app = express();
const port = 5000;

// * middleware
app.use(cors());
app.use(express.json());

const { MongoClient, ServerApiVersion, ObjectId } = mongodb;
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.kmw7lj5.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
	serverApi: {
		version: ServerApiVersion.v1,
		strict: true,
		deprecationErrors: true,
	},
});

async function run() {
	try {
		// Connect the client to the server	(optional starting in v4.7)
		await client.connect();

		const contactCollection = client.db("ContactsDB").collection("Contacts");

		app.post("/contacts", async (req, res) => {
			const result = await contactCollection.insertOne(req.body);
			res.send(result);
		});

		app.get("/contacts", async (_, res) => {
			const cursor = await contactCollection.find().toArray();
			res.send(cursor);
		});

		app.get("/contacts/:id", async (req, res) => {
			const result = await contactCollection.findOne({
				_id: new ObjectId(req.params.id),
			});
			res.send(result);
		});

		app.delete("/contacts/:id", async (req, res) => {
			const result = await contactCollection.deleteOne({
				_id: new ObjectId(req.params.id),
			});
			res.send(result);
		});

		app.put(`/contacts/:id`, async (req, res) => {
			const filter = { _id: new ObjectId(req.params.id) };
			const updated = { $set: req.body };
			const options = { upsert: true };
			const result = await contactCollection.updateOne(
				filter,
				updated,
				options
			);
			res.send(result);
		});

		// Send a ping to confirm a successful connection
		// await client.db("admin").command({ ping: 1 });
		console.log(
			"Pinged your deployment. You successfully connected to MongoDB!"
		);
	} finally {
		// Ensures that the client will close when you finish/error
		// await client.close();
	}
}
run().catch(console.dir);

// app.get("/", (req, res) => {
// 	res.send("Server is running");
// });

app.listen(port, () => {
	console.log("server running on port ", port);
});
