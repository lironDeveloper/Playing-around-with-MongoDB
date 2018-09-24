const expect = require('expect');
const request = require('supertest');

var {app} = require('./../server');
var {ToDo} = require('./../Models/todo');

// Running a script before the test to set up the DB as we want
beforeEach((done) => {
    ToDo.remove({})
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

                ToDo.find()
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
                    expect(todos.length).toBe(0);
                    done();
                })
                .catch((e) => {
                    done(e);
                });
            });
    });
})