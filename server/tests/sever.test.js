const expect = require('expect');
const request = require('supertest');
const {ObjectID} = require('mongodb');

var {app} = require('./../server');
var {ToDo} = require('./../Models/todo');


const todos = [{
    _id: new ObjectID(),
    text: 'first test todo'
}, {
    _id: new ObjectID(),
    text: 'second test todo'
}];

// Running a script before the test to set up the DB as we want
beforeEach((done) => {
    ToDo.remove({})
        .then(() => {
            return ToDo.insertMany(todos);
        })
        .then(() => {
            done();
        })
})

describe('POST /todos', () => {
    it('Should create a new TODO', (done) => {
        var text = 'Test TODO text';

        request(app)
            .post('/todos')
            .send({text})
            .expect(200)
            .expect((res) => {
                expect(res.body.text).toBe(text);
            })
            .end((err,res) => {
                if(err){
                    done(err);
                    return;
                }

                ToDo.find({text})
                .then((todos) => {
                    expect(todos.length).toBe(1);
                    expect(todos[0].text).toBe(text);
                    done();
                })
                .catch((e) => {
                    done(e);
                });
            });
    });

    it('Should not create TODO with invalid body data', (done) => {

        request(app)
            .post('/todos')
            .send({})
            .expect(400)
            .end((err,res) => {
                if(err){
                    done(err);
                    return;
                }

                ToDo.find()
                .then((todos) => {
                    expect(todos.length).toBe(2);
                    done();
                })
                .catch((e) => {
                    done(e);
                });
            });
    });
});

describe('GET /todos', () => {
    it('Should return all todos', (done) => {
        request(app)
            .get('/todos')
            .expect(200)
            .expect((res) => {
                expect(res.body.todos.length).toBe(2);
            })
            .end(done);
    });
});

describe('GET /todos/id', () => {
    it('Should return a todo doc', (done) => {
        request(app)
            .get(`/todos/${todos[0]._id.toHexString()}`)
            .expect(200)
            .expect((res) => {
                expect(res.body.todo.text).toBe(todos[0].text);
            })
            .end(done);
    });

    it('Should return a 404 if todo not found', (done) => {

        var fakeID = new ObjectID();
        request(app)
            .get(`/todos/${fakeID.toHexString()}`)
            .expect(404)
            .end(done);
    });

    it('Should return a 404 for non-object ids', (done) => {
        request(app)
            .get(`/todos/123`)
            .expect(404)
            .end(done);
    });
});