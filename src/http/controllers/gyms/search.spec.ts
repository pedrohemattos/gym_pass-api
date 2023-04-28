import { app } from '../../../app';
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import request from 'supertest';
import { createAndAuthenticateUser } from '../../../utils/test/create-and-authenticate-user';

describe('Search Gym (e2e)', () => {
  beforeAll(async () => {
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  })

  it('should be able to search gyms by title', async () => {
    const { token } = await createAndAuthenticateUser(app, true);

    await request(app.server)
      .post('/gyms')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'JavaScript Gym',
        description: 'Gym 1',
        phone: '99999999',
        latitude: -27.5907332,
        longitude: -48.5560008
      })

    await request(app.server)
      .post('/gyms')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'TypeScript Gym',
        description: 'Gym 2',
        phone: '99999999',
        latitude: -27.5907332,
        longitude: -48.5560008
      })

    const response = await request(app.server)
      .get('/gyms/search')
      .query({
        query: 'Type'
      })
      .set('Authorization', `Bearer ${token}`)
      .send()

    expect(response.statusCode).toEqual(200);
    expect(response.body.gyms).toHaveLength(1);
    expect(response.body.gyms).toEqual([
      expect.objectContaining({
        title: 'TypeScript Gym'
      })
    ]);
  });
});