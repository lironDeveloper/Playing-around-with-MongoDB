const {ObjectID} = require('mongodb');

const {mongoose} = require('./../server/DB/mongoose-conf');
const {ToDo} = require('./../server/Models/todo');

var id = "5ba80cd79c1e9e336461e983";

// ToDo.remove({})
//     .then((result) => {
       
//         console.log(result);
//     })
//     .catch((e) =>{console.log(e);});

//ToDo.findOneAndRemove()
// ToDo.findByIdAndRemove()

ToDo.findByIdAndRemove('5ba8ef71b6e7533d60761848')
    .then((todo) => {
        console.log(todo);
    });

ToDo.findOneAndRemove({_id: '5ba8ef71b6e7533d60761848'})
    .then((todo) => {
        console.log(todo);
    });