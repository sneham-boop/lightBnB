// Database configuration
const { Pool } = require("pg");

const dbConfig = {
  user: "vagrant",
  password: "123",
  host: "localhost",
  database: "lightbnb",
};
const pool = new Pool(dbConfig);
pool.query(`SELECT * FROM properties LIMIT 1;`).then((response) => {
  console.log("Connected to the database successfully!!");
});

/// Users

/**
 * Get a single user from the database given their email.
 * @param {String} email The email of the user.
 * @return {Promise<{}>} A promise to the user.
 */
const getUserWithEmail = function (email) {
  const queryString = 
  `SELECT *
  FROM users
  WHERE email = $1`;
  const queryParams = [email.toLowerCase()];
  return pool
    .query(queryString, queryParams)
    .then((response) => response.rows[0])
    .catch((error) => error.message);
};
exports.getUserWithEmail = getUserWithEmail;

/**
 * Get a single user from the database given their id.
 * @param {string} id The id of the user.
 * @return {Promise<{}>} A promise to the user.
 */
const getUserWithId = function (id) {
  const queryString = 
  `SELECT *
  FROM users
  WHERE id = $1`;
  const queryParams = [id];
  return pool
    .query(queryString, queryParams)
    .then((response) => response.rows[0])
    .catch((error) => error.message);
};
exports.getUserWithId = getUserWithId;

/**
 * Add a new user to the database.
 * @param {{name: string, password: string, email: string}} user
 * @return {Promise<{}>} A promise to the user.
 */
const addUser = function (user) {
  const { name, email, password } = user;
  const queryString = 
  `INSERT INTO users (name, email, password)
  VALUES ($1, $2, $3) 
  RETURNING *;`;
  const queryParams = [name, email.toLowerCase(), password];
  return pool
    .query(queryString, queryParams)
    .then((response) => response.rows[0])
    .catch((error) => error.message);
};
exports.addUser = addUser;

/// Reservations

/**
 * Get all reservations for a single user.
 * @param {string} guest_id The id of the user.
 * @return {Promise<[{}]>} A promise to the reservations.
 */
const getAllReservations = function (guest_id, limit = 10) {
  const queryString = 
  `SELECT reservations.*, properties.*, AVG(property_reviews.rating) AS avg_rating
  FROM reservations
  JOIN properties ON reservations.property_id = properties.id
  JOIN property_reviews ON properties.id = property_reviews.property_id
  WHERE 
    reservations.guest_id = $1 AND
    reservations.end_date < now()::date
  GROUP BY reservations.id, properties.id
  ORDER BY start_date
  LIMIT $2;`;
  const queryParams = [guest_id, limit];
  return pool
    .query(queryString, queryParams)
    .then((response) => response.rows)
    .catch((error) => error.message);
};
exports.getAllReservations = getAllReservations;

/// Properties

/**
 * Get all properties.
 * @param {{}} options An object containing query options.
 * @param {*} limit The number of results to return.
 * @return {Promise<[{}]>}  A promise to the properties.
 */
const getAllProperties = function (options, limit = 10) {
  let queryParams = [];
  let queryString = `SELECT properties.*, AVG(property_reviews.rating) as average_rating
  FROM properties
  JOIN property_reviews ON properties.id = property_reviews.property_id
  GROUP BY properties.id
  `;

  // Own properties
  if (options.owner_id) {
    queryParams.push(parseInt(options.owner_id));
    queryString += `HAVING properties.owner_id = $${queryParams.length}
    `;
  }

  // Assembly options for query
  let optionsQuery = "HAVING ";
  let and = " AND ";

  if (options.city) {
    let city = "";
    queryParams.push(`%${options.city}%`);
    city = `city LIKE $${queryParams.length}`;
    optionsQuery += `${city}`;
  }

  if (options.minimum_price_per_night && options.maximum_price_per_night) {
    // Convert from $ to cents
    let minMaxPrice = "";
    const minPrice = options.minimum_price_per_night * 100;
    const maxPrice = options.maximum_price_per_night * 100;
    queryParams.push(minPrice);
    queryParams.push(maxPrice);
    minMaxPrice = `cost_per_night >= $${
      queryParams.length - 1
    } AND cost_per_night <= $${queryParams.length}`;
    if (optionsQuery.length > 7) optionsQuery += and + `${minMaxPrice}`;
    else optionsQuery += `${minMaxPrice}`;
  }

  if (options.minimum_rating) {
    let rating = "";
    queryParams.push(parseInt(options.minimum_rating));
    rating = `AVG(property_reviews.rating) >= $${queryParams.length}`;
    if (optionsQuery.length > 7) optionsQuery += and + `${rating}`;
    else optionsQuery += `${rating}`;
  }

  // Add options to query
  if (optionsQuery.length > 7) {
    queryString += optionsQuery;
  }

  // Final query edit
  queryParams.push(limit);
  queryString += `
  LIMIT $${queryParams.length};
  `;

  return pool
    .query(queryString, queryParams)
    .then((response) => {
      const limitedProperties = response.rows;
      return limitedProperties;
    })
    .catch((error) => {
      return error.message;
    });
};
exports.getAllProperties = getAllProperties;

/**
 * Add a property to the database
 * @param {{}} property An object containing all of the property details.
 * @return {Promise<{}>} A promise to the property.
 */
const addProperty = function (property) {
  let queryParams = [];
  for(const key in property) {
    queryParams.push(property[key]);
  }
  let queryString = 
  `INSERT INTO properties 
  (title, description, number_of_bedrooms, number_of_bathrooms, parking_spaces, cost_per_night, thumbnail_photo_url, cover_photo_url, street, country, city, province, post_code, owner_id, active)
  VALUES
  ($1, $2, $3 , $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, TRUE)
  RETURNING *`;
  console.log(queryParams);
  return pool
    .query(queryString, queryParams)
    .then((response) => {
      console.log(response.rows[0]);
      return response.rows[0];
    });
};
exports.addProperty = addProperty;
