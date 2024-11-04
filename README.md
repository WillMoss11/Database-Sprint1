# Movie Rental System

## Overview
This CLI application serves as a management tool for a movie rental system. It allows users to interact with a PostgreSQL database containing information about movies, customers, and movie rentals

## Features
- Create database tables for movies, customers, and rentals if they don't already exist
- Insert new movies into the database.
- Update a customer's email address.
- Remove a customer and their rental history.
- Display all movies in the database.

## Prerequisites
Before running this application, ensure you have the following installed:
- Node.js (v22 is recommended)
- PostgreSQL server running


## How to Use this Template

This repository is set up as a **GitHub template** to help you quickly create your own version of the **Movie Rental System**.

### Steps to Create Your Own Repository

1. **Click the "Use this template" button** at the top of this page on GitHub.
   
1. **Name your new repository** and choose its visibility (public or private).

1. Once your repository is created, **clone your new repo** to your local machine:
    ```bash
    git clone <your-new-repo-url>
    ```

1. Navigate into the project directory and install the necessary dependencies:
    ```bash
    cd <your-new-repo-name>
    npm install
    ```
  
1. **Run the app:**
    ```bash
    node index.js
    ```

By using this template, you'll have the project structure and initial setup ready to go, so you can focus on building the functionality!


## Usage
Run the application with the following commands:

### Insert a Movie
To insert a new movie, use:
```bash
node index.js insert "<title>" <year> "<genre>" "<director>"
```
Example:
```bash
node index.js insert "Inception" 2010 "Science Fiction" "Christopher Nolan"
```

### Show All Movies
To display all movies in the database, use:
```bash
node index.js show
```

### Update Customer Email
To update a customer's email address, use:
```bash
node index.js update <customer_id> "<new_email>"
```
Example:
```bash
node index.js update 1 "newemail@example.com"
```

### Remove a Customer
To remove a customer from the database, use:
```bash
node index.js remove <customer_id>
```
Example:
```bash
node index.js remove 1
```

### Help Command
To view all available commands, use:
```bash
node index.js
```

## Notes
- Make sure your PostgreSQL server is running and that you have created a database for the application to connect to.
- Modify the database connection details in the code to match your PostgreSQL setup.



# Database Normalization: 3NF Explanation

This document outlines how the tables in the Movie Rental System database are designed to meet the criteria for Third Normal Form (3NF), which is essential for minimizing redundancy and ensuring data integrity.

### 1. Movies Table
- **Primary Key**: `movie_id`
  - Uniquely identifies each movie in the table.
- **Attributes**:
  - `title`: The title of the movie.
  - `release_year`: The year the movie was released.
  - `genre`: The genre of the movie.
  - `director`: The director of the movie.
  
All attributes are fully functionally dependent on the `movie_id`, and there are no transitive dependencies, ensuring compliance with 3NF.

### 2. Customers Table
- **Primary Key**: `customer_id`
  - Uniquely identifies each customer.
- **Attributes**:
  - `first_name`: The first name of the customer.
  - `last_name`: The last name of the customer.
  - `email`: The email address of the customer (unique).
  - `phone_number`: The customer's phone number.

Each attribute is dependent on the `customer_id`, and the uniqueness of the email ensures that no two customers share the same email address, further maintaining data integrity.

### 3. Rentals Table
- **Primary Key**: `rental_id`
  - Uniquely identifies each rental record.
- **Foreign Keys**:
  - `customer_id`: References the `Customers` table.
  - `movie_id`: References the `Movies` table.

These foreign keys establish a many-to-one relationship, allowing multiple rentals to be associated with a single customer or movie. The attributes `rental_date` and `return_date` are directly related to the rental record and do not depend on other attributes, adhering to 3NF principles.

