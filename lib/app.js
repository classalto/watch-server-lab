const express = require('express');
const cors = require('cors');
const client = require('./client.js');
const app = express();
const morgan = require('morgan');
const ensureAuth = require('./auth/ensure-auth');
const createAuthRoutes = require('./auth/create-auth-routes');

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(morgan('dev')); // http logging

const authRoutes = createAuthRoutes();

// setup authentication routes to give user an auth token
// creates a /auth/signin and a /auth/signup POST route. 
// each requires a POST body with a .email and a .password
app.use('/auth', authRoutes);

// everything that starts with "/api" below here requires an auth token!
app.use('/api', ensureAuth);

// and now every request that has a token in the Authorization header will have a `req.userId` property for us to see who's talking
app.get('/api/test', (req, res) => {
  res.json({
    message: `in this proctected route, we get the user's id like so: ${req.userId}`
  });
});

app.get('/watches', async(req, res) => {
  try {
    const data = await client.query(`
          SELECT watches.*, brands.brand_name from watches
          JOIN brands
          ON watches.brand_id = brands.id;
    `);
    
    res.json(data.rows);
  } catch(e) {
    
    res.status(500).json({ error: e.message });
  }
});

// GET categories end-point
app.get('/brands', async(req, res) => {
  try {
    const data = await client.query('SELECT * from brands');
    
    res.json(data.rows);
  } catch(e) {
    
    res.status(500).json({ error: e.message });
  }
});

// GET single row end-point
app.get('/watches/:id', async(req, res) => {
  try {
    const id = req.params.id;
    const data = await client.query(`
      SELECT 
      watches.id,
      watches.brand_id,
      watches.name,
      watches.limited,
      watches.diameter_mm,
      watches.price,
      watches.image,
      watches.description,
      brands.brand_name,
      watches.owner_id 
      FROM watches 
      JOIN brands
      ON watches.brand_id = brands.id
      WHERE watches.id=$1;
      `, [id]);
    
    res.json(data.rows[0]);
  } catch(e) {
    
    res.status(500).json({ error: e.message });
  }
});

// PUT end-point
app.put('/watches/:id', async(req, res) => {
  try {
    const id = req.params.id;
    const data = await client.query(`
    UPDATE watches 
    SET 
    brand_id = $1, 
    name = $2, 
    limited = $3, 
    diameter_mm = $4, 
    price = $5, 
    image = $6, 
    description = $7
    WHERE watches.id = $8 
    returning *;`,

    [
      req.body.brand_id,
      req.body.name,
      req.body.limited,
      req.body.diameter_mm,
      req.body.price,
      req.body.image,
      req.body.description,
      id
    ]);
    
    res.json(data.rows[0]);
  } catch(e) {
    
    res.status(500).json({ error: e.message });
  }
});

// Post end-point
app.post('/watches', async(req, res) => {
  try {
    const data = await client.query(
      'INSERT INTO watches (brand_id, name, limited, diameter_mm, price, image, description, owner_id) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) returning *', 
      [
        req.body.brand_id,
        req.body.name,
        req.body.limited,
        req.body.diameter_mm,
        req.body.price,
        req.body.image,
        req.body.description,
        1
      ]);
    
    res.json(data.rows[0]);
  } catch(e) {
    
    res.status(500).json({ error: e.message });
  }
});

// DELETE end-point
app.delete('/watches/:id', async(req, res) => {
  try {
    const id = req.params.id;
    const data = await client.query('DELETE FROM watches WHERE watches.id = $1 returning *', [id]);
    
    res.json(data.rows[0]);
  } catch(e) {
    
    res.status(500).json({ error: e.message });
  }
});


app.use(require('./middleware/error'));

module.exports = app;
