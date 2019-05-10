# CSE 305: E-Commerce System
### Authors

- <u>Frontend</u>: Andy Liang (111008856)
- ReactJS
- <u>Backend</u>: Johnny So (111158276)
- Express & NodeJS

### Description

- A small e-commerce system that allows for the selling and purchasing of items.
  - Customers can register and search for items they would like to purchase.
  - Sellers can register and display items they would like to list to sell.
- <u>Note</u>: this project was built with a focus on development using a SQL datastore as opposed to building, deploying, and scaling an online cloud service. Some parts of the system that were not the focus were intentionally simplified.

### Directory Structure

- `back-end/`
  - the home directory for the Express back-end
- `data/`
  - initial test data for the project to be used with `scripts/populate_tables.sql`
- `docs/`
  - documentation for the project including
    - the ER diagram
    - SQL mapping
    - list of supported transactions
    - PowerPoint slides
- `front-end/`
  - the home directory for the ReactJS front-end
- `scripts/`
  - `SQL` scripts that initialize the tables

### Project Documentation

​	The documentation for each stage of development for the project is below. Each stage is separated into its own file for ease of access and readability.

1. [ER Diagram Stage](docs/er_description.pdf)
   1.  `docs/er_diagram.jpg` 
   2.  `docs/er_description.pdf`
2. [ER Diagram to SQL Mapping Stage](docs/sql_description.pdf)
   1. `docs/sql_description.pdf`
3. [Supported Transactions](docs/transactions.pdf)
   1. `docs/transactions.pdf`

### Installation and Deployment

1. Extract the files while preserving the project directory structure
2. In the `front-end` and `back-end` servers,
   1. `npm install`
   2. `npm run start` - the front and back-end servers should now be hosted locally on your machine.
3. The front-end should be accessible from `http://localhost:3000`.