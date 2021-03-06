const { expect } = require('chai');
const { syncAndSeed } = require('./db');
const supertest = require('supertest');
const app = supertest(require('./app'));

describe('The API', ()=> {
  let seed;
  beforeEach(async()=> {
    seed = await syncAndSeed();
  });
  describe('seeded data', ()=> {
    it('The Weeknd is one of the artists', ()=> {
      const weeknd = seed.artists.weeknd;
      expect(weeknd).to.be.ok;
    });
    it('Metalica is one of the artists', ()=> {
      expect(seed.artists.metalica.name).to.equal('Metalica');
    });
  });
  describe('artists routes', ()=> {
    describe('GET /api/artists', ()=> {
      it('returns the artists', async()=> {
        const response = await app.get('/api/artists');
        expect(response.status).to.equal(200);
        expect(response.body.length).to.equal(3);
        const names = response.body.map( artist => artist.name);
        expect(names).to.eql(['Adele', 'Metalica', 'The Weeknd']);
      });
    });
  });
  describe('albums routes', ()=> {
    describe('GET /api/albums', ()=> {
      it('returns the albums', async()=> {
        const response = await app.get('/api/albums');
        expect(response.status).to.equal(200);
        expect(response.body.length).to.equal(4);
        const afterHours = response.body.find( album => album.name === 'After Hours');
        expect(afterHours).to.be.ok;
        expect(afterHours.artist.name).to.equal('The Weeknd');
      });
    });
    describe('GET /api/albums/:id/tracks', ()=> {
      it('returns the albums tracks', async()=> {
        const response = await app.get(`/api/albums/${seed.albums.afterHours.id}/tracks`);
        expect(response.status).to.equal(200);
        const songNames = response.body.map( track => track.song.name);
        const expected = [
          'In Your Eyes',
          'Blinding Lights',
          'Save Your Tears'
        ];
        expect(songNames).to.eql(expected);
      });
    });
  });
});
