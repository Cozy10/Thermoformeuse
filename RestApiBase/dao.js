var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/";
var nomdb = "test_db";


async function saveConfiguration(conf){
    
    const client = new MongoClient(url);

    await client.connect();

    await client.db(nomdb).collection("configurations").insertOne(conf, function(err, res) {
        if (err) throw err;
        console.log("configuration bien enregistrée !!");
        client.close();
    });
}


async function getConfigurationByNom(nom){
  
    const client = new MongoClient(url);
 
    try {
        await client.connect();

        return await client.db(nomdb).collection("configurations").findOne({'nom' : nom}) ;
 
    } catch (e) {
        throw (e);
    } finally {
        await client.close();
    }
}

async function getAllConfiguration(){
    const client = new MongoClient(url);
    try {
        await client.connect();

        return await client.db(nomdb).collection("configurations").find().toArray() ;
 
    } catch (e) {
        throw (e);
    } finally {
        await client.close();
    }
}


async function saveLog(log){
    
    const client = new MongoClient(url);

    await client.connect();

    await client.db(nomdb).collection("logs").insertOne(log, function(err, res) {
        if (err) throw err;
        console.log("log bien enregistrée!!");
        client.close();
    });
}

async function getAllLog(){
    const client = new MongoClient(url);
    try {
        await client.connect();

        return await client.db(nomdb).collection("logs").find().toArray() ;
 
    } catch (e) {
        throw (e);
    } finally {
        await client.close();
    }
}

exports.getAllConfiguration = getAllConfiguration
exports.getConfigurationByNom = getConfigurationByNom
exports.saveConfiguration = saveConfiguration
exports.getAllLog = getAllLog
exports.saveLog = saveLog
