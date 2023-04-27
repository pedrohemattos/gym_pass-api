import request from "supertest"
import { app } from "../../../app";
import { createAndAuthenticateUser } from "../../../utils/test/create-and-authenticate-user";
import { describe, expect, it, beforeAll, afterAll } from "vitest";

describe('Fetch Nearby Gyms (e2e)', () => {
  beforeAll(async () => {
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  })


  it('should be able to list nearby gyms', async () => {
    const { token } = await createAndAuthenticateUser(app);

    await request(app.server)
      .post('/gyms')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'JavaScript Gym',
        description: 'Near Gym',
        phone: '99999999',
        latitude: -27.5907332,
        longitude: -48.5560008
      })

    await request(app.server)
      .post('/gyms')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'TypeScript Gym',
        description: 'Far Gym',
        phone: '99999999',
        latitude: -27.6755245,
        longitude: -48.5053035
      })

    const response = await request(app.server)
      .get('/gyms/nearby')
      .query({
        latitude: -27.5907332,
        longitude: -48.5560008
      })
      .set('Authorization', `Bearer ${token}`)
      .send()
    
    expect(response.statusCode).toEqual(200);
    expect(response.body.gyms).toHaveLength(1);
    expect(response.body.gyms).toEqual([
      expect.objectContaining({ title: 'JavaScript Gym' })
    ]);
  });

})