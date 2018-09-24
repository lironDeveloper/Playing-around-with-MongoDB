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
    text: 'second test todo',
    completed: true,
    completedAt: 333
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

describe('GET /todos/:id', () => {
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

describe('DELETE /todos/:id', () => {
    it('Should remove a todo', (done) => {
        request(app)
            .delete(`/todos/${todos[0]._id.toHexString()}`)
            .expect(200)
            .expect((res) => {
                expect(res.body.todo._id).toBe(todos[0]._id.toHexString());
            })
            .end((err, res) => {
                if(err) {
                    return done(err);
                }

                // query db using findbyid tonotexist
                ToDo.findById(todos[0]._id.toHexString())
                    .then((todo) => {
                        expect(todo).toBe(null);
                        done();
                    })
                    .catch((e) => {
                        done(e);
                    });
            });
    });

    it('Should return 404 if todo not found', (done) => {

        var fakeID = new ObjectID();
        request(app)
            .delete(`/todos/${fakeID.toHexString()}`)
            .expect(404)
            .end(done);
    });

    it('Should return 40 if object ID is invalid', (done) => {
        request(app)
        .delete(`/todos/123`)
        .expect(404)
        .end(done);
    });
});

describe('PATCH /todos/:id', () => {
    it('Should update the todo', (done) => {

        var newText = `New Text for editing!`;
        var oldText = todos[0].text;

        request(app)
            .patch(`/todos/${todos[0]._id.toHexString()}`)
            .send({
                text: newText,
                completed: true
            })
            .expect(200)
            .expect((res) => {
                var updatedTodo = res.body.todo;

                expect(updatedTodo.text).toBe(newText);
                expect(updatedTodo.completed).toBe(true);
                expect(typeof(updatedTodo.completedAt)).toBe('number');
            })
            .end((err, res) => {
                if(err) {
                    return done(err);
                }
                return done();
            });
    });

    it('Should clear completedAt when TODO is not completed', (done) => {
        var newText = `New Text for editing!`;
        var oldText = todos[1].text;

        request(app)
            .patch(`/todos/${todos[1]._id.toHexString()}`)
            .send({
                text: newText,
                completed: false
            })
            .expect(200)
            .expect((res) => {
                var updatedTodo = res.body.todo;

                expect(updatedTodo.text).toBe(newText);
                expect(updatedTodo.completed).toBe(false);
                expect(updatedTodo.completedAt).toBeFalsy();
            })
            .end((err, res) => {
                if(err) {
                    return done(err);
                }
                return done();
            });
    });
});