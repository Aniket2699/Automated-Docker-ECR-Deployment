const request = require('supertest');

const app = require('../index.js'); // Adjust if your app filename is app.js


describe('GET /nonexistentpage', function() {

  it('should respond with 404 Not Found', function(done) {

    request(app)

      .get('/nonexistentpage')

      .expect(404, done); // This is a cleaner way to end test if only checking status

  });

});
