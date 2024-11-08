const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

// PostgreSQL connection
const pool = new Pool({
  user: 'postgres', // Your username
  host: 'localhost',
  database: 'movie_rental', // Change to your database name
  password: 'postgres', // Your database password
  port: 5432,
});

// Function to execute SQL file
async function executeSQLFile(filePath) {
  const sql = fs.readFileSync(filePath, 'utf8');
  await pool.query(sql);
}

/**
 * Creates the database tables.
 */
async function createTable() {
  const createMoviesTable = `
    CREATE TABLE IF NOT EXISTS Movies (
      movie_id SERIAL PRIMARY KEY,
      title VARCHAR(255) NOT NULL,
      release_year INT NOT NULL,
      genre VARCHAR(100) NOT NULL,
      director VARCHAR(255) NOT NULL
    );
  `;

  const createCustomersTable = `
    CREATE TABLE IF NOT EXISTS Customers (
      customer_id SERIAL PRIMARY KEY,
      first_name VARCHAR(100) NOT NULL,
      last_name VARCHAR(100) NOT NULL,
      email VARCHAR(255) UNIQUE NOT NULL,
      phone_number TEXT NOT NULL
    );
  `;

  const createRentalsTable = `
    CREATE TABLE IF NOT EXISTS Rentals (
      rental_id SERIAL PRIMARY KEY,
      customer_id INT REFERENCES Customers(customer_id),
      movie_id INT REFERENCES Movies(movie_id),
      rental_date DATE NOT NULL,
      return_date DATE
    );
  `;

  await pool.query(createMoviesTable);
  await pool.query(createCustomersTable);
  await pool.query(createRentalsTable);
}

/**
 * Inserts a new movie into the Movies table.
 */
async function insertMovie(title, year, genre, director) {
  try {
    const insertQuery = `
      INSERT INTO Movies (title, release_year, genre, director)
      VALUES ($1, $2, $3, $4) RETURNING movie_id;
    `;
    const res = await pool.query(insertQuery, [title, year, genre, director]);
    console.log(`Inserted movie with ID: ${res.rows[0].movie_id}`);
  } catch (error) {
    console.error('Error inserting movie:', error);
  }
}

/**
 * Prints all movies in the database to the console.
 */
async function displayMovies() {
  try {
    const result = await pool.query('SELECT * FROM Movies;');
    if (result.rows.length === 0) {
      console.log('No movies found.');
    } else {
      result.rows.forEach(movie => {
        console.log(`ID: ${movie.movie_id}, Title: ${movie.title}, Year: ${movie.release_year}, Genre: ${movie.genre}, Director: ${movie.director}`);
      });
    }
  } catch (error) {
    console.error('Error retrieving movies:', error);
  }
}

/**
 * Updates a customer's email address.
 */
async function updateCustomerEmail(customerId, newEmail) {
  try {
    const updateQuery = `
      UPDATE Customers
      SET email = $1
      WHERE customer_id = $2;
    `;
    const res = await pool.query(updateQuery, [newEmail, customerId]);
    if (res.rowCount > 0) {
      console.log(`Updated customer ${customerId}'s email to ${newEmail}`);
    } else {
      console.log(`Customer with ID ${customerId} not found.`);
    }
  } catch (error) {
    console.error('Error updating customer email:', error);
  }
}

/**
 * Removes a customer from the database along with their rental history.
 */
async function removeCustomer(customerId) {
  try {
    await pool.query('DELETE FROM Rentals WHERE customer_id = $1;', [customerId]);
    const res = await pool.query('DELETE FROM Customers WHERE customer_id = $1;', [customerId]);
    if (res.rowCount > 0) {
      console.log(`Removed customer with ID: ${customerId}`);
    } else {
      console.log(`Customer with ID ${customerId} not found.`);
    }
  } catch (error) {
    console.error('Error removing customer:', error);
  }
}

/**
 * Prints a help message to the console.
 */
function printHelp() {
  console.log("Movie Rentals");
  console.log("-----------------------------");
  console.log('Usage:');
  console.log('  insert <title> <year> <genre> <director> - Insert a movie');
  console.log('  show - Show all movies');
  console.log('  update <customer_id> <new_email> - Update a customer\'s email');
  console.log('  remove <customer_id> - Remove a customer from the database');
}

/**
 * Runs our CLI app to manage the movie rentals database.
 */
async function runCLI() {
  await createTable();
  
  // Execute SQL file after creating the tables
  await executeSQLFile(path.join(__dirname, 'sql', 'movie_rental.sql'));

  const args = process.argv.slice(2);
  switch (args[0]) {
    case 'insert':
      if (args.length !== 5) {
        printHelp();
        return;
      }
      await insertMovie(args[1], parseInt(args[2]), args[3], args[4]);
      break;
    case 'show':
      await displayMovies();
      break;
    case 'update':
      if (args.length !== 3) {
        printHelp();
        return;
      }
      await updateCustomerEmail(parseInt(args[1]), args[2]);
      break;
    case 'remove':
      if (args.length !== 2) {
        printHelp();
        return;
      }
      await removeCustomer(parseInt(args[1]));
      break;
    default:
      printHelp();
      break;
  }
}

runCLI().catch(err => {
  console.error('Error running CLI:', err);
}).finally(() => {
  pool.end(); // Close the connection pool when done
});
