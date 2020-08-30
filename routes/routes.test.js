const supertest = require('supertest');

const app = require('../server');

const request = supertest.agent(app);

describe('TEST SUITE FOR ROUTE: /get-currency-list-with-rates', () => {
  describe('This is a test with correct URL', () => {
    it('should successfully return currency list', (done) => {
      request
        .get('/get-currency-list-with-rates')
        .expect(200)
        .then((response) => {
          expect(response.status).toEqual(200);
          done();
        });
    });
  });

  describe('This is a test with bad URL', () => {
    it('should fail to return currency list', (done) => {
      request
        .get('/get-currency-list-with-ratez')
        .expect(404)
        .then((response) => {
          expect(response.status).toEqual(404);
          done();
        });
    });
  });
});

describe('TEST SUITE FOR ROUTE: /convert-currency/:from/:to/:amount', () => {
  describe('This is a test with correct information', () => {
    it('should successfully return converted currency', (done) => {
      request
        .get('/convert-currency/GBP/CAD/80')
        .expect(200)
        .then((response) => {
          expect(response.status).toEqual(200);
          expect(response.body).toEqual({
            success: 'Currency converted: 80 GBP = 139.07 CAD',
            responseValue: '139.07',
            requestValue: '80',
          });
          done();
        });
    });
  });

  describe('THIS IS A TEST SUITE WITHOUT FILLED OUT PARAMETERS', () => {
    describe('This is a test with undefined as currency(from)', () => {
      it('should not convert currency and return error', (done) => {
        request
          .get('/convert-currency/undefined/CAD/80')
          .expect(400)
          .then((response) => {
            expect(response.status).toEqual(400);
            expect(response.body).toHaveProperty(
              'failure',
              'undefined currency doesnt exist on our DB'
            );
            done();
          });
      });
    });

    describe('This is a test with null as currency(from)', () => {
      it('should not convert currency and return error', (done) => {
        request
          .get('/convert-currency/null/CAD/80')
          .expect(400)
          .then((response) => {
            expect(response.status).toEqual(400);
            expect(response.body).toHaveProperty(
              'failure',
              'null currency doesnt exist on our DB'
            );
            done();
          });
      });
    });

    describe('This is a test with [] as currency(from)', () => {
      it('should not convert currency and return error', (done) => {
        request
          .get('/convert-currency/[]/CAD/80')
          .expect(400)
          .then((response) => {
            expect(response.status).toEqual(400);
            expect(response.body).toHaveProperty(
              'failure',
              '[] currency doesnt exist on our DB'
            );
            done();
          });
      });
    });

    describe('This is a test with "" as currency(from)', () => {
      it('should not convert currency and return error', (done) => {
        request
          .get('/convert-currency/""/CAD/80')
          .expect(400)
          .then((response) => {
            expect(response.status).toEqual(400);
            expect(response.body).toHaveProperty(
              'failure',
              '"" currency doesnt exist on our DB'
            );
            done();
          });
      });
    });

    describe('This is a test with {} as currency(from)', () => {
      it('should not convert currency and return error', (done) => {
        request
          .get('/convert-currency/{}/CAD/80')
          .expect(400)
          .then((response) => {
            expect(response.status).toEqual(400);
            expect(response.body).toHaveProperty(
              'failure',
              '{} currency doesnt exist on our DB'
            );
            done();
          });
      });
    });

    describe('This is a test with undefined as currency(to)', () => {
      it('should not convert currency and return error', (done) => {
        request
          .get('/convert-currency/GBP/undefined/80')
          .expect(400)
          .then((response) => {
            expect(response.status).toEqual(400);
            expect(response.body).toHaveProperty(
              'failure',
              'undefined currency doesnt exist on our DB'
            );
            done();
          });
      });
    });

    describe('This is a test with null as currency(to)', () => {
      it('should not convert currency and return error', (done) => {
        request
          .get('/convert-currency/GBP/null/80')
          .expect(400)
          .then((response) => {
            expect(response.status).toEqual(400);
            expect(response.body).toHaveProperty(
              'failure',
              'null currency doesnt exist on our DB'
            );
            done();
          });
      });
    });

    describe('This is a test with [] as currency(to)', () => {
      it('should not convert currency and return error', (done) => {
        request
          .get('/convert-currency/GBP/[]/80')
          .expect(400)
          .then((response) => {
            expect(response.status).toEqual(400);
            expect(response.body).toHaveProperty(
              'failure',
              '[] currency doesnt exist on our DB'
            );
            done();
          });
      });
    });

    describe('This is a test with "" as currency(to)', () => {
      it('should not convert currency and return error', (done) => {
        request
          .get('/convert-currency/GBP/""/80')
          .expect(400)
          .then((response) => {
            expect(response.status).toEqual(400);
            expect(response.body).toHaveProperty(
              'failure',
              '"" currency doesnt exist on our DB'
            );
            done();
          });
      });
    });

    describe('This is a test with {} as currency(to)', () => {
      it('should not convert currency and return error', (done) => {
        request
          .get('/convert-currency/GBP/{}/80')
          .expect(400)
          .then((response) => {
            expect(response.status).toEqual(400);
            expect(response.body).toHaveProperty(
              'failure',
              '{} currency doesnt exist on our DB'
            );
            done();
          });
      });
    });

    describe('This is a test with undefined as amount', () => {
      it('should not convert currency and return error', (done) => {
        request
          .get('/convert-currency/GBP/CAD/undefined')
          .expect(400)
          .then((response) => {
            expect(response.status).toEqual(400);
            expect(response.body).toHaveProperty(
              'failure',
              'Must be a positive number'
            );
            done();
          });
      });
    });
    describe('This is a test with [] as amount', () => {
      it('should not convert currency and return error', (done) => {
        request
          .get('/convert-currency/GBP/CAD/[]')
          .expect(400)
          .then((response) => {
            expect(response.status).toEqual(400);
            expect(response.body).toHaveProperty(
              'failure',
              'Must be a positive number'
            );
            done();
          });
      });
    });
  });

  describe('THIS IS A TEST SUITE FOR AMOUNT PARAMETER VALIDATION', () => {
    describe('This is a test with positive number', () => {
      it('should successfully return converted currency', (done) => {
        request
          .get('/convert-currency/GBP/CAD/80')
          .expect(200)
          .then((response) => {
            expect(response.status).toEqual(200);
            expect(response.body).toEqual({
              success: 'Currency converted: 80 GBP = 139.07 CAD',
              responseValue: '139.07',
              requestValue: '80',
            });
            done();
          });
      });
    });

    describe('This is a test with a letter', () => {
      it('should not convert currency and return validation error', (done) => {
        request
          .get('/convert-currency/GBP/CAD/e')
          .expect(400)
          .then((response) => {
            expect(response.status).toEqual(400);
            expect(response.body).toHaveProperty(
              'failure',
              'Must be a positive number'
            );
            done();
          });
      });
    });

    describe('This is a test with negative number', () => {
      it('should not convert currency and return validation error', (done) => {
        request
          .get('/convert-currency/GBP/CAD/-1')
          .expect(400)
          .then((response) => {
            expect(response.status).toEqual(400);
            expect(response.body).toHaveProperty(
              'failure',
              'Amount must be a positive number'
            );
            done();
          });
      });
    });

    describe('This is a test with positive number longer than 12 digits', () => {
      it('should not convert currency and return validation error', (done) => {
        request
          .get('/convert-currency/GBP/CAD/11234534343453435453')
          .expect(400)
          .then((response) => {
            expect(response.status).toEqual(400);
            expect(response.body).toHaveProperty(
              'failure',
              'Amount must not be longer than 12 digits'
            );
            done();
          });
      });
    });
  });
});
