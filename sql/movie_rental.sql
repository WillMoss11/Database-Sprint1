-- ===================
-- Database Tables
-- ===================

DROP TABLE IF EXISTS Rentals;
DROP TABLE IF EXISTS Customers;
DROP TABLE IF EXISTS Movies;

CREATE TABLE Movies (
    movie_id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    release_year INT NOT NULL,
    genre VARCHAR(100) NOT NULL,
    director VARCHAR(255) NOT NULL
);

CREATE TABLE Customers (
    customer_id SERIAL PRIMARY KEY,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone_number TEXT NOT NULL
);

CREATE TABLE Rentals (
    rental_id SERIAL PRIMARY KEY,
    customer_id INT REFERENCES Customers(customer_id),
    movie_id INT REFERENCES Movies(movie_id),
    rental_date DATE NOT NULL,
    return_date DATE
);

-- ===================
-- Sample Data
-- ===================
INSERT INTO Movies (title, release_year, genre, director) VALUES
('Inception', 2010, 'Sci-Fi', 'Christopher Nolan'),
('The Godfather', 1972, 'Crime', 'Francis Ford Coppola'),
('Pulp Fiction', 1994, 'Crime', 'Quentin Tarantino'),
('The Dark Knight', 2008, 'Action', 'Christopher Nolan'),
('Forrest Gump', 1994, 'Drama', 'Robert Zemeckis');

INSERT INTO Customers (first_name, last_name, email, phone_number) VALUES
('Jacob', 'Jones', 'jacob@example.com', '444-1234'),
('Jim', 'Moss', 'jim@example.com', '444-5678'),
('Alix', 'John', 'alix@example.com', '444-8765'),
('Billy', 'Brown', 'billy@example.com', '444-4321'),
('Charlie', 'Davis', 'charlie@example.com', '444-9876');

INSERT INTO Rentals (customer_id, movie_id, rental_date, return_date) VALUES
(1, 1, '2024-10-23', '2024-11-06'),
(1, 2, '2024-10-24', '2024-11-07'),
(2, 3, '2024-10-25', '2024-11-08'),
(3, 4, '2024-10-26', '2024-11-09'),
(4, 1, '2024-10-27', '2024-11-10'),
(5, 5, '2024-10-28', '2024-11-11'),
(2, 1, '2024-10-29', '2024-11-12'),
(3, 2, '2024-10-30', 'NULL'),
(1, 3, '2024-10-31', 'NULL'),
(4, 5, '2024-11-1', 'NULL');

-- ===================
-- Queries
-- ===================
-- 1. Find all movies rented by a specific customer, given their email.
SELECT m.title
FROM Movies m
JOIN Rentals r ON m.movie_id = r.movie_id
JOIN Customers c ON r.customer_id = c.customer_id
WHERE c.email = 'jacob@example.com';

-- 2. Given a movie title, list all customers who have rented the movie.
SELECT c.first_name, c.last_name
FROM Customers c
JOIN Rentals r ON c.customer_id = r.customer_id
JOIN Movies m ON r.movie_id = m.movie_id
WHERE m.title = 'Inception';

-- 3. Get the rental history for a specific movie title.
SELECT c.first_name, c.last_name, r.rental_date, r.return_date
FROM Rentals r
JOIN Movies m ON r.movie_id = m.movie_id
JOIN Customers c ON r.customer_id = c.customer_id
WHERE m.title = 'The Godfather';

-- 4. For a specific movie director: Find the name of the customer, the date of the rental, and title of the movie.
SELECT c.first_name, c.last_name, r.rental_date, m.title
FROM Rentals r
JOIN Movies m ON r.movie_id = m.movie_id
JOIN Customers c ON r.customer_id = c.customer_id
WHERE m.director = 'Christopher Nolan';

-- 5. List all currently rented out movies (movies whose return dates haven't been met).
SELECT m.title, r.rental_date, c.first_name, c.last_name
FROM Rentals r
JOIN Movies m ON r.movie_id = m.movie_id
JOIN Customers c ON r.customer_id = c.customer_id
WHERE r.return_date IS NULL;
