const client = require('../lib/client');
// import our seed data:
const watches = require('./watches.js');
const brands = require('./brand-data.js');
const usersData = require('./users.js');
const { getEmoji } = require('../lib/emoji.js');

run();

async function run() {

  try {
    await client.connect();

    const users = await Promise.all(
      usersData.map(user => {
        return client.query(`
                      INSERT INTO users (email, hash)
                      VALUES ($1, $2)
                      RETURNING *;
                  `,
        [user.email, user.hash]);
      })
    );
      
    const user = users[0].rows[0];

    await Promise.all(
      brands.map(category => {
        return client.query(`
                    INSERT INTO brands (brand_name)
                    VALUES ($1);
                `,
        [category.brand_name]);
      })
    );
    
    await Promise.all(
      watches.map(watch => {
        return client.query(`
                    INSERT INTO watches (brand_id, name, limited, diameter_mm, price, image, description, owner_id)
                    VALUES ($1, $2, $3, $4, $5, $6, $7, $8);
                `,
        [watch.brand_id, watch.name, watch.limited, watch.diameter_mm, watch.price, watch.image, watch.description, user.id]);
      })
    );
    

    console.log('seed data load complete', getEmoji(), getEmoji(), getEmoji());
  }
  catch(err) {
    console.log(err);
  }
  finally {
    client.end();
  }
    
}
