import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from './../src/app.module';

describe('Authentication System', () => {
    let app: INestApplication<App>;

    beforeEach(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule],
        }).compile();

        app = moduleFixture.createNestApplication();
        await app.init();
    });

    it('handles a signup request', () => {
        const email = 'fan123@asd.com'

        return request(app.getHttpServer())
            .post('/auth/signup')
            .send({ email, password: 'asdasd' })
            .expect(201)
            .then((res) => {
                const { id, email } = res.body;
                expect(id).toBeDefined();
                expect(email).toEqual(email);
            });
    });

    it('signup as a new user then get the currently logged in user', async () => {
        const email = 'new@asd.com'

        const res = await request(app.getHttpServer())
            .post('/auth/signup')
            .send({ email, password: 'asdasd' })
            .expect(201)

        const cookies = res.get('Set-Cookie')[0];
        expect(cookies).toBeDefined();
        const cookieHeader = cookies ? cookies[0] : ''

        const { body } = await request(app.getHttpServer())
            .get('/auth/whoami')
            .set('Cookie', cookieHeader)
            .expect(200);

        expect(body.email).toEqual(email);
    })
});
