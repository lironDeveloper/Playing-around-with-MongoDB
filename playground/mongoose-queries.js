const {ObjectID} = require('mongodb');

const {mongoose} = require('./../server/DB/mongoose-conf');
const {ToDo} = require('./../server/Models/todo');
const {User} = require('./../server/Models/user');

// var id = "5ba8cf817deb652f3c183aa211";

// if(!ObjectID.isValid(id)) {
//     console.log('ID not valid');
// }

// ToDo.find({
//     _id: id
// }).then((todos) => {
//     console.log(`Todos ${todos}`);
// });

// ToDo.findOne({
//     _id: id
// }).then((todo) => {
//     console.log(`Todo ${todo}`);
// });

// ToDo.findById(id)
//     .then((todo) => {
//         if(!todo) {
//             return console.log('Id not found');
//         }
//         console.log('Todo by Id', todo);
//     })
//     .catch((err) => {
//         console.log(err);
//     });

var id = "5ba80cd79c1e9e336461e983";

User.findById(id)
    .then((user) => {
        if(!user) {
            return console.log('User not found');
        }
        console.log('User by id', user);
    })
    .catch((e) =>{console.log(e);});