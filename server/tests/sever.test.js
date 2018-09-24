const expect = require('expect');
const request = require('supertest');

var {app} = require('./../server');
var {ToDo} = require('./../Models/todo');


const todos = [{
    text: 'first test todo'
}, {
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