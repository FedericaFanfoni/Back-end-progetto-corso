import { MongoClient } from "mongodb"

const client = new MongoClient("mongodb://localhost:27017");
const db = client.db("progetto");

export const progettoDB = {
    articoli: db.collection("articoli"),
    accounts: db.collection("accounts")
}