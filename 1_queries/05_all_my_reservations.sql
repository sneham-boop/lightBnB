SELECT reservations.id, properties.title, properties.cost_per_night, start_date, AVG(property_reviews.rating) AS avg_rating
FROM reservations
JOIN properties ON reservations.property_id = properties.id
JOIN property_reviews ON properties.id = property_reviews.property_id
WHERE reservations.guest_id = 1
GROUP BY reservations.id, properties.id
ORDER BY start_date
LIMIT 10;