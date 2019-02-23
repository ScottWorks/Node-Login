const request = require('supertest'),
  serverUrl = request('http://localhost:4000');

describe('POST /api/login', function() {
  it('Login with incorrect employee_id', function(done) {
    serverUrl
      .post('/api/login')
      .send({ employee_id: '11111', password: '123' })
      .expect(401, done);
  });

  it('Login with incorrect password', function(done) {
    serverUrl
      .post('/api/login')
      .send({ employee_id: '1111', password: '1234' })
      .expect(401, done);
  });

  it('Redirect after successful login', function(done) {
    serverUrl
      .post('/api/login')
      .send({ employee_id: '1111', password: '123' })
      .expect(302)
      .expect('location', '/api/1111')
      .end(done);
  });

  var cookie;
  before(function(done) {
    serverUrl
      .post('/api/login')
      .send({ employee_id: '1111', password: '123' })
      .end(function(err, res) {
        cookie = res.headers['set-cookie'];
        done();
      });
  });

  it('Fetch user data after successful login', function(done) {
    serverUrl
      .get('/api/1111')
      .set('cookie', cookie)
      .expect(200, {
        id: 1,
        employee_id: '1111',
        password: '123',
        role: 'owner'
      })
      .end(done);
  });

  it('Fetch another users data after successful login', function(done) {
    serverUrl
      .get('/api/1112')
      .set('cookie', cookie)
      .expect(403, done);
  });
});

describe('POST /api/register', function() {
  it('Resgister with invalid employee_id', function(done) {
    serverUrl
      .post('/api/register')
      .send({ employee_id: '', password: '12345', role: 'mechanic' })
      .expect(400, done);
  });

  it('Register with invalid password', function(done) {
    serverUrl
      .post('/api/register')
      .send({ employee_id: '1115', password: '', role: 'mechanic' })
      .expect(400, done);
  });

  it('Register with invalid role', function(done) {
    serverUrl
      .post('/api/register')
      .send({ employee_id: '1115', password: '12345', role: '' })
      .expect(400, done);
  });

  it('Register with duplicate employee_id', function(done) {
    serverUrl
      .post('/api/register')
      .send({ employee_id: '1111', password: '12345', role: 'mechanic' })
      .expect(400, done);
  });

  it('Redirect after successful registration', function(done) {
    serverUrl
      .post('/api/login')
      .send({ employee_id: '1115', password: '12345', role: 'mechanic' })
      .expect(302)
      .expect('location', '/api/1115')
      .end(done);
  });

  var cookie;
  before(function(done) {
    serverUrl
      .post('/api/register')
      .send({ employee_id: '1115', password: '12345', role: 'mechanic' })
      .end(function(err, res) {
        cookie = res.headers['set-cookie'];
        done();
      });
  });

  it('Fetch user data after successful registration', function(done) {
    serverUrl
      .get('/api/1115')
      .set('cookie', cookie)
      .expect(200, {
        id: 5,
        employee_id: '1115',
        password: '12345',
        role: 'mechanic'
      })
      .end(done);
  });
});

describe('GET /api/:employee_id', function() {
  it('Block unauthenticated requests', function(done) {
    serverUrl.get('/api/1111').expect(401, done);
  });
});
