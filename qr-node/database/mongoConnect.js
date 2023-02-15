const mongodb = require("mongodb");
const MongoClient = mongodb.MongoClient;

let _db;

// const MONGODB_URLINK = `mongodb+srv://${process.env.MONGODB_NAME}:${process.env.MONGODB_PASS}@cluster01.zshtev5.mongodb.net/qr-attendance?retryWrites=true&w=majority`
// const MONGODB_URL = `mongodb+srv://${process.env.MONGODB_NAME}:${process.env.MONGODB_PASS}@cluster01.zshtev5.mongodb.net/${process.env.MONGODB_DB}?retryWrites=true&w=majority`
const MONGODB_URL = "mongodb://localhost:27017/qr-attendance";
const mongoConnect = (callback) => {
  MongoClient.connect(MONGODB_URL)
    .then((client) => {
      console.log("Connected!");
      _db = client.db(); 
      callback(); 
    })
    .catch((err) => {
      console.log(err);
      throw err;
    });
};

const getDb = () => {
  if (_db) {
    return _db;
  }
  throw "No database found!";
};

exports.mongoConnect = mongoConnect;
exports.getDb = getDb;
