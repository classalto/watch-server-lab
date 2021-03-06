require('dotenv').config();

const { execSync } = require('child_process');

const fakeRequest = require('supertest');
const app = require('../lib/app');
const client = require('../lib/client');

describe('app routes', () => {
  describe('routes', () => {
    let token;
  
    beforeAll(async done => {
      execSync('npm run setup-db');
  
      client.connect();
  
      const signInData = await fakeRequest(app)
        .post('/auth/signup')
        .send({
          email: 'jon@user.com',
          password: '1234'
        });
      
      token = signInData.body.token; // eslint-disable-line
  
      return done();
    });
  
    afterAll(done => {
      return client.end(done);
    });

    test('returns watches', async() => {

      const expectation = [
        {
          'id': 3,
          'brand_id': 1,
          'name': 'seamaster bullhead 930',
          'limited': false,
          'diameter_mm': 27,
          'price': 9000,
          'image': 'https://cdn.watchbase.com/watch/lg/origin:jpg/omega/seamaster-bullhead/st-146-011-f.webp',
          'description': 'The Omega Seamaster Bullhead was introduced in 1969. Together with the Flightmaster, it is one of the most notable examples of Omega\'s late sixties creativity in design.',
          'owner_id': 1,
          'brand_name': 'omega'
        },
        {
          'id': 2,
          'brand_id': 1,
          'name': 'seamaster planet ocean 600m',
          'limited': false,
          'diameter_mm': 45,
          'price': 3300,
          'image': 'https://cdn.watchbase.com/watch/lg/origin:png/omega/seamaster-planet-ocean/2208-50-00-2e.webp',
          'description': 'The Omega Seamaster Bullhead was introduced in 1969. Together with the Flightmaster, it is one of the most notable examples of Omega\'s late sixties creativity in design.',
          'owner_id': 1,
          'brand_name': 'omega'
        },
        {
          'id': 6,
          'brand_id': 2,
          'name': 'recraft cushion stainless steel',
          'limited': false,
          'diameter_mm': 43,
          'price': 800,
          'image': 'https://cdn.watchbase.com/watch/lg/origin:jpg/seiko/recraft/snkn01-47.webp',
          'description': 'The Seiko Recraft SNKN01 was introduced in 2014. It pairs a cushion-shaped case with a dial with sunburst finish. It is motivated by Seiko\'s self-winding caliber 7S26, which can be seen through the case back.',
          'owner_id': 1,
          'brand_name': 'seiko'
        },
        {
          'id': 5,
          'brand_id': 2,
          'name': 'prospex diver ssc489P1 ',
          'limited': false,
          'diameter_mm': 44,
          'price': 580,
          'image': 'https://cdn.watchbase.com/watch/lg/origin:jpg/seiko/prospex-divers/ssc489p1-7e.webp',
          'description': 'Since 1965, when Seiko launched its first diver’s watch, Seiko has been at the forefront of the technology of diver’s watches and many of the attributes now considered essential in the best diver’s watches were invented by Seiko.',
          'owner_id': 1,
          'brand_name': 'seiko'
        },
        {
          'id': 4,
          'brand_id': 2,
          'name': 'mechanical alpinist stainless steel',
          'limited': false,
          'diameter_mm': 39,
          'price': 4000,
          'image': 'https://cdn.watchbase.com/watch/lg/origin:png/seiko/mechanical/sarb017-89.webp',
          'description': 'The Seiko Alpinist SARB017 was introduced in 2006.',
          'owner_id': 1,
          'brand_name': 'seiko'
        },
        {
          'id': 7,
          'brand_id': 3,
          'name': 'galactic 36 automatic stainless steel',
          'limited': false,
          'diameter_mm': 36,
          'price': 7850,
          'image': 'https://cdn.watchbase.com/watch/lg/origin:jpg/breitling/galactic/c3733012-ba54-376c-5c.webp',
          'description': 'Designed for women wishing to enjoy a blend of refined luxury and uncompromising technical sophistication',
          'owner_id': 1,
          'brand_name': 'breitling'
        },
        {
          'id': 8,
          'brand_id': 4,
          'name': 'link caliber 6',
          'limited': true,
          'diameter_mm': 39,
          'price': 2350,
          'image': 'https://cdn.watchbase.com/watch/lg/origin:jpg/tag-heuer/link/wjf211cba0570-c3.webp',
          'description': 'For more than 20 years, the Link, the direct descendent of the famous S/el, has symbolized success, self-confidence and determination. The watch is easily recognizable by its bracelet of double-S links, a worldwide standard for flexibility, comfort, and ergonomics.',
          'owner_id': 1,
          'brand_name': 'tagheuer'
        },
        {
          'id': 10,
          'brand_id': 5,
          'name': 'ds super ph500m stainless steel',
          'limited': false,
          'diameter_mm': 43,
          'price': 500,
          'image': 'https://cdn.watchbase.com/watch/lg/origin:jpg/certina/heritage-collection/c037-407-17-280-10-b.webp',
          'description': 'The Certina DS Super PH500M is a special edition introduced in 2020. This retro-styled watch features a stainelss steel case of 42mm paired with an orange dial.',
          'owner_id': 1,
          'brand_name': 'certina'
        },
        {
          'id': 9,
          'brand_id': 5,
          'name': 'ds rookie chronograph',
          'limited': true,
          'diameter_mm': 40,
          'price': 370,
          'image': 'https://cdn.watchbase.com/watch/lg/origin:png/certina/gent-quartz-collection/c0164171705700-34.webp',
          'description': 'This Certina Gent Quartz Collection DS Rookie Chronograph, ref. C016.417.17.057.00, has a stainless steel case and a rubber strap. The watch has a black dial and a date display at 6 o\'clock. ',
          'owner_id': 1,
          'brand_name': 'certina'
        }
      ];

      const data = await fakeRequest(app)
        .get('/watches')
        .expect('Content-Type', /json/)
        .expect(200);

      expect(data.body).toEqual(expect.arrayContaining(expectation));
    });
    
    test('returns watch', async() => {
      
      const expectation =
      {
        'id': 3,
        'brand_id': 1,
        'name': 'seamaster bullhead 930',
        'limited': false,
        'diameter_mm': 27,
        'price': 9000,
        'image': 'https://cdn.watchbase.com/watch/lg/origin:jpg/omega/seamaster-bullhead/st-146-011-f.webp',
        'description': 'The Omega Seamaster Bullhead was introduced in 1969. Together with the Flightmaster, it is one of the most notable examples of Omega\'s late sixties creativity in design.',
        'owner_id': 1,
        'brand_name': 'omega'
      };
      
      const data = await fakeRequest(app)
        .get('/watches/3')
        .expect('Content-Type', /json/);
        
      
      expect(data.body).toEqual(expectation);

    
    });

    test('should delete row from watches', async() => {
      
      const expectation =
        {
          'id': 1,
          'brand_id': 1,
          'name': 'speedmaster professional plexi',
          'limited': false,
          'diameter_mm': 42,
          'price': 3200,
          'image': 'https://cdn.watchbase.com/watch/lg/origin:png/omega/speedmaster/3570-50-00-18.webp',
          'description': 'The Omega Seamaster Bullhead was introduced in 1969. It is powered by the hand-wound caliber 930, which is turned 90 degrees counter clockwise in order to get to the bullhead look. It features an internal rotating bezel. The case measures 41.5 * 42 mm and is made of stainless steel. Together with the Flightmaster, it is one of the most notable examples of Omega\'s late sixties creativity in design.',
          'owner_id': 1
        };
      
      const data = await fakeRequest(app)
        .delete('/watches/1')
        .expect('Content-Type', /json/)
        .expect(200);
      
      expect(data.body).toEqual(expectation);
      
      const nothing = await fakeRequest(app)
        .get('/watches/1')
        .expect('Content-Type', /json/)
        .expect(200);
      
      expect(nothing.body).toEqual('');
    });

    test('should update column data for existing row', async() => {

      const newWatch = {
        'brand_id': 5,
        'name': 'updated watch',
        'limited': true,
        'diameter_mm': 70,
        'price': 30,
        'image': 'no image',
        'description': 'updated watch just arrived'
      };
      
      const expectation =
        {
          'brand_id': 5,
          'brand_name': 'certina',
          'name': 'updated watch',
          'limited': true,
          'diameter_mm': 70,
          'price': 30,
          'image': 'no image',
          'description': 'updated watch just arrived',
          'id': 8,
          'owner_id': 1
        };
      
      await fakeRequest(app)
        .put('/watches/8')
        .send(newWatch)
        .expect('Content-Type', /json/)
        .expect(200);
      
      
      const updated = await fakeRequest(app)
        .get('/watches/8')
        .expect('Content-Type', /json/)
        .expect(200);
      
      expect(updated.body).toEqual(expectation);
    });

    test('should create new row in table', async() => {

      const newWatch = {
        'brand_id': 2,
        'name': 'cruddy watch',
        'limited': true,
        'diameter_mm': 100,
        'price': 1000,
        'image': 'https://cdn.watchbase.com/watch/lg/origin:png/omega/speedmaster/3570-50-00-18.webp',
        'description': 'A brand new cruddy crud watch for cruddy programmers working at a cruddy tech startup.',
      };
      
      const expectation =
        {
          ... newWatch,
          'id': 11,
          'owner_id': 1,
          'brand_name': 'seiko'
        };
      
      await fakeRequest(app)
        .post('/watches')
        .send(newWatch)
        .expect('Content-Type', /json/)
        .expect(200);
      
      
      
      const allWatches = await fakeRequest(app)
        .get('/watches')
        .expect('Content-Type', /json/)
        .expect(200);

      const findPosted = allWatches.body.find((watch) => watch.name === 'cruddy watch');
      
      expect(findPosted).toEqual(expectation);
    });
  });
});
