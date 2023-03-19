const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

class initMogoDB {
    // @ initSettings
    initDBSetting(database,collention) {
        const uri = process.env.MOGODB_URI;
        const client = new MongoClient(uri);
        const db = client.db(database)
        const coll = db.collection(collention);
        return { db, coll, client }
    }


    // @ Find All 
    async findAllData(database,collention) {
        const { coll } = this.initDBSetting(database,collention)
        return coll.find().toArray()
                .then(
                    room => console.log(room)
                ).catch(
                    err => console.log(err)
                ); 
    }


    // @ Find one 
    async findOneData(database,collention,findData) {
        const { client, coll } = this.initDBSetting(database,collention)
        return coll.findOne(findData)
                .then(
                    (data) => {
                        client.close()
                        return data
                    }
                ).catch(
                    (err) => {
                        client.close()
                        alert(err)
                        throw new Error(err)
                    }
                ); 
    }


    //  @ insert Data
    async insertOneData(database,collention,insertData) {
        const { client ,coll } = this.initDBSetting(database,collention)
        coll.insertOne(insertData)
            .then(()=> {
                client.close()
            })
            .catch(err => {
                client.close()
                alert(err)
                throw new Error(err)
            })
    }


    // @ replaceOne Data
    async replaceOne(database,collention,findData,replaceData) {
        const { client ,coll } = this.initDBSetting(database,collention)
        coll.replaceOne(findData,replaceData)
            .then(()=> {
                client.close()
            })
            .catch(err => {
                client.close()
                throw new Error(err)
            })
    }


    // @ update Data
    async updateOne(database,collention,findData,replaceData) {
        const { client ,coll } = this.initDBSetting(database,collention)
        coll.updateOne(findData,{"$set":replaceData})
            .then(()=> {
                client.close()
            })
            .catch(err => {
                client.close()
                throw new Error(err)
            })
    }
}



module.exports = initMogoDB