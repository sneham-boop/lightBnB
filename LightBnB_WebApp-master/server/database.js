const properties = require("./json/properties.json");
const users = require("./json/users.json");
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
  const text = `SELECT *
  FROM users
  WHERE email LIKE $1`;
  return pool
    .query(text, [email])
    .then(response => {
      console.log(response.rows)
      return response.rows[0]})
    .catch(error => error.message);
};
exports.getUserWithEmail = getUserWithEmail;

/**
 * Get a single user from the database given their id.
 * @param {string} id The id of the user.
 * @return {Promise<{}>} A promise to the user.
 */
const getUserWithId = function (id) {
  const text = `SELECT *
  FROM users
  WHERE id = $1`;
  return pool
    .query(text, [id])
    .then(response => response.rows[0])
    .catch(error => error.message);
};
exports.getUserWithId = getUserWithId;

/**
 * Add a new user to the database.
 * @param {{name: string, password: string, email: string}} user
 * @return {Promise<{}>} A promise to the user.
 */
const addUser = function (user) {
  const {name, email, password} = user;
  const text = 
  `INSERT INTO users 
  (name, email, password)
  VALUES ($1, $2, $3) 
  RETURNING *;`
  return pool
    .query(text, [name, email, password])
    .then((response) => {
      return response.rows[0];
    })
    .catch(error => error.message);
};
exports.addUser = addUser;

/// Reservations

/**
 * Get all reservations for a single user.
 * @param {string} guest_id The id of the user.
 * @return {Promise<[{}]>} A promise to the reservations.
 */
const getAllReservations = function (guest_id, limit = 10) {
  // return getAllProperties(null, 2);
  const text = `SELECT reservations.*, properties.*, AVG(property_reviews.rating) AS avg_rating
  FROM reservations
  JOIN properties ON reservations.property_id = properties.id
  JOIN property_reviews ON properties.id = property_reviews.property_id
  WHERE reservations.guest_id = $1
  GROUP BY reservations.id, properties.id
  ORDER BY start_date
  LIMIT $2;`;
  return pool
    .query(text, [guest_id, limit])
    .then(response => response.rows)
    .catch(error => error.message);
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
  const text = `SELECT *
  FROM properties
  LIMIT $1`;
  return pool
    .query(text, [limit])
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
  const propertyId = Object.keys(properties).length + 1;
  property.id = propertyId;
  properties[propertyId] = property;
  return Promise.resolve(property);
};
exports.addProperty = addProperty;
