const chai = require('chai');
const chaiHttp = require('chai-http');
const http = require('http');
const app = require('../app'); // Импортируйте приложение, а не сервер
const expect = chai.expect;

chai.use(chaiHttp);

describe('API /api/items', () => {
    let server;

    before((done) => {
        server = http.createServer(app); // Создаем сервер на основе приложения
        server.listen(3001, done); // Запускаем сервер на порту 3001
    });

    after((done) => {
        if (server && server.listening) { // Закрываем сервер после выполнения тестов
            server.close(done);
        } else {
            done();
        }
    });

    it('should return all items', (done) => {
        chai.request(server)
            .get('/api/items')
            .end((err, res) => {
                expect(res).to.have.status(200);
                expect(res.body).to.be.an('array');
                done();
            });
    });
});
