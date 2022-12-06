import {MongoClient} from "mongodb";

async function handler(req, res) {
    const requestMethod = req.method;


    switch (requestMethod) {
        case 'POST':
            const {email, name, message} = req.body;

            if (
                !email ||
                !email.includes('@') ||
                !name ||
                name.trim() === '' ||
                !message ||
                message.trim() === ''
            ) {
                res.status(422).json({message: 'Invalid input.'});
                return;
            }

            const newMessage = {
                id: new Date().toISOString(),
                email,
                name,
                message
            }

            let client;
            const connectionString = `mongodb+srv://${process.env.mongodb_username}:${process.env.mongodb_password}@${process.env.mongodb_clustername}.ktrohp2.mongodb.net/${process.env.mongodb_database}?retryWrites=true&w=majority`

            try {
                client = await MongoClient.connect(
                    connectionString
                );
            } catch (error) {
                res.status(500).json({message: 'Connecting to the database failed!'});
                return;
            }

            const db = client.db();
            try {
                const result = await db.collection('messages').insertOne(newMessage);
                newMessage.id = result.insertedId;
                res.status(201).json({message: 'Success!', submittedMessage: newMessage});
            } catch (error) {
                res.status(500).json({message: 'Storing message failed!'});
            }
            client.close();
            break;
        default:
            res.status(405).json({message: `Method ${requestMethod} not allowed.`});
    }

}

export default handler;