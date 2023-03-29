const admin = require("firebase-admin");
const { getDatabase } = require('firebase-admin/database');
const serviceAccount = require(process.env.SERVICE_ACCOUNT_PATH);

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: process.env.FIREBASE_DATABASE_URL
});


exports.getRTDB_Data = (readPath) => {
    const db = getDatabase();
    const ref = db.ref(readPath);

    return new Promise((resolve)=> {
        // Attach an asynchronous callback to read the data at our posts reference
        ref.once('value', (snapshot) => {
            return resolve(snapshot.val())
        }, (errorObject) => {
            console.log('The read failed: ' + errorObject.name);
            throw new Error(errorObject.name)
        }); 
    })
}

exports.setRTDB_Data = (updatePath,newValue) => {
    const db = getDatabase();
    const ref = db.ref(updatePath);
    ref.set(newValue)
}