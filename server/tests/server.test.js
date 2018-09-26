const expect = require('expect');
const request = require('supertest');
const {ObjectID} = require('mongodb');

var {app} = require('./../server');
var {ToDo} = require('./../Models/todo');
var {User} = require('./../Models/user');
const {todos, populateTodos, users, populateUsers} = require('./seed/seed');

beforeEach(populateUsers);
beforeEach(populateTodos);

describe('POST /todos', () => {
    it('Should create a new TODO', (done) => {
        var text = 'blablalasdgasdgadgfd';
        request(app)
            .post('/todos')
            .send({text})
            .expect(200)
            .expect((res) => {
                expect(res.body.text).toBe(text);

            })
            .end((err,res) => {
                if(err){
                    //console.log(err)
                    return done(err);
                    
                }

                ToDo.find({})
                .then((todos) => {
                    expect(todos.length).toBe(3);
                    expect(todos[0].text).toBe("first test todo");
                    return done();
                })
                .catch((e) => {
                    console.log(e)
                    return done(e);
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

describe('GET /users/me', () => {
    it('Should return user if authenticated', (done) => {

        request(app)
            .get('/users/me')
            .set('x-auth', users[0].tokens[0].token)
            .expect(200)
            .expect((res) => {
                expect(res.body._id).toBe(users[0]._id.toHexString());
                expect(res.body.email).toBe(users[0].email);
            })
            .end(done);
    });

    it('Should return 401 if not authenticated', (done) => {
        request(app)
            .get('/users/me')
            .expect(401)
            .expect((res) => {
                expect(res.body).toEqual({});
            })
            .end(done);
    });
});

describe('POST /users', () => {
    it('Should create a user', (done) => {

        request(app)
            .post('/users')
            .send({
                email: "example@gmail.com",
                password: "Aa123123"
            })
            .expect(200)
            .expect((res) => {
                expect(res.headers['x-auth']).toBeTruthy();
                expect(res.body.email).toBe("example@gmail.com");
                expect(res.body._id).toBeTruthy();                
            })
            .end((err) => {
                if(err){
                   return done(err);
                }

                User.find({email: "example@gmail.com"})
                    .then((user) => {
                        expect(user).toBeTruthy();
                        //expect(user.password).toNotBe("Aa123123")
                        done();
                    })
                    .catch((err) => {
                        done(err);
                    });
            });
            
    });

    it('Should return validation errors if request invalid', (done) => {
        request(app)
            .post('/users')
            .send({
                email: "123",
                password: ""
            })
            .expect(400)
            .end(done);
    });

    it('Should not create user if email in use', (done) => {
        request(app)
        .post('/users')
        .send({
            email: users[0].email,
            password: "asdfasfasf"
        })
        .expect(400)
        .end(done);
    });
});

describe('POST /users/login', () => {
    it('Should loggin user and return a token', (done) => {
        request(app)
            .post('/users/login')
            .send({email: users[1].email, password: users[1].password})
            .expect(200)
            .expect((res) => {
                expect(res.headers['x-auth']).toBeTruthy();
            })
            .end((err, res) => {
                if(err) {
                    return done(err);
                }

                User.findById(users[1]._id)
                    .then((user) => {
                        expect(user.tokens[0]).toMatchObject({
                            access: 'auth',
                            token: res.headers['x-auth']
                        });
                        done();
                    })
                    .catch((e) => {done(e);});
            });
    });

    it('Should reject invalid loggin', (done) => {
        request(app)
        .post('/users/login')
        .send({email: users[1].email, password: "asdfasdfasdf"})
        .expect(400)
        .expect((res) => {
            expect(res.headers['x-auth']).toBeFalsy();
        })
        .end((err, res) => {
            if(err) {
                return done(err);
            }

            User.findById(users[1]._id)
                .then((user) => {
                    expect(user.tokens).toHaveLength(0);
                    done();
                })
                .catch((e) => {done(e);});
        });
    });
});

describe('DELETE /users/me/token', () => {
    it('Should remove auth token on logout', (done) => {
        request(app)
        .delete('/users/me/token')
        .set('x-auth', users[0].tokens[0].token)
        .expect(200)
        .end((err, res) => {
            if(err) {
                return done(err);
            }

            User.findById(users[0]._id)
                .then((user) => {
                    expect(user.tokens).toHaveLength(0);
                    done();
                })
                .catch((e) => {done(e);});
        })
    });
});