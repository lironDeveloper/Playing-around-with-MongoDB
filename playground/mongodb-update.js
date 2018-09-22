const {MongoClient, ObjectID} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/ToDoApp', { useNewUrlParser: true }, (err, db) => {
    if(err) {
        console.log('Unable to connect to the ToDoApp mongodb server');
        return;
    } 
    console.log('Connected to the ToDoApp mongodb server succesfuly!');

    db.collection('Todos').findOneAndUpdate({
        text: 'Travel Liron'
    },{
         $set:{completed: true}
    }, {
        returnOriginal: false
    })
    .then((result) =>{
        //console.log(result);
    });

    db.collection('Users').findOneAndUpdate({
        name: 'Liron'
    },{
         $set:{name: 'Olga'}, $inc: {age: 1}
    }, {
        returnOriginal: false
    })
    .then((result) =>{
        console.log(result);
    });

    db.close();
});