import { MongoClient } from 'mongodb';


class DBClient {
  constructor() {
    const host = process.env.DB_HOST || '127.0.0.1';
    const port = process.env.DB_PORT || 27017;
    const database = process.env.DB_DATABASE || 'fueldey';
    const dbURL = `mongodb://${host}:${port}/${database}`;
    this.client = new MongoClient(dbURL, { useUnifiedTopology: true });

    this.isAliv = false; // added property to track connection status
    this.connect(); // call connect method to establish the connection
  }

  async connect() {
    try {
      await this.client.connect();
      this.isAliv = true; // set isAlive property to true after successful connection
    } catch (error) {
      console.error('Failed to connect to MongoDB:', error);
    }
  }

  isAlive() {
    return this.isAliv;
  }

  async nbUsers() {
    return this.client.db().collection('users').estimatedDocumentCount();
  }

}

const dbClient = new DBClient();

const uu = async () => { 
    const gg = await dbClient.client.db().collection('users').findOne({"email": "richardchekwas@gmail.com"});
    console.log(gg);
};
uu();


export default dbClient;
