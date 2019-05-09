DROP DATABASE IF EXISTS ecommerce;

CREATE DATABASE IF NOT EXISTS ecommerce;

USE ecommerce;

/* CREATE EntityTypes */

CREATE TABLE IF NOT EXISTS item_type (
    id INT NOT NULL AUTO_INCREMENT,
    category CHAR(32) NOT NULL,
    PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS item (
    id INT NOT NULL AUTO_INCREMENT,
    item_name CHAR(64) NOT NULL,
    item_description CHAR(255) NOT NULL,
    category INT,
    PRIMARY KEY (id),
    FOREIGN KEY (category) 
        REFERENCES item_type(id)
        ON UPDATE CASCADE
        ON DELETE SET NULL 
);

CREATE TABLE IF NOT EXISTS seller (
    id INT NOT NULL AUTO_INCREMENT,
    seller_name CHAR(64) NOT NULL,
    seller_description CHAR(255) NOT NULL,
    pwd CHAR(255) NOT NULL,
    PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS customer (
    id INT NOT NULL AUTO_INCREMENT,
    first_name CHAR(32) NOT NULL,
    last_name CHAR(32) NOT NULL,
    email CHAR(64) NOT NULL,
    phone CHAR(15) NOT NULL,
    pwd CHAR(255) NOT NULL,
    PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS address (
    customer_id INT NOT NULL,
    id INT NOT NULL AUTO_INCREMENT,
    address_type TINYINT(0) NOT NULL,  /* for 'billing' or 'shipping' */
    address1 CHAR(64) NOT NULL,
    address2 CHAR(64),
    apt CHAR(64),
    city CHAR(64) NOT NULL,
    zip CHAR(5) NOT NULL,
    PRIMARY KEY (id),
    FOREIGN KEY (customer_id)
        REFERENCES customer(id)
        ON UPDATE CASCADE
        ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS shoppingcart (
    customer_id INT NOT NULL,
    item_id INT NOT NULL,
    quantity TINYINT NOT NULL,
    PRIMARY KEY (customer_id, item_id),
    FOREIGN KEY (customer_id)
        REFERENCES customer(id)
        ON UPDATE CASCADE
        ON DELETE CASCADE,
    FOREIGN KEY (item_id)
        REFERENCES item(id)
        ON UPDATE CASCADE
        ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS carrier (
    id INT NOT NULL AUTO_INCREMENT,
    carrier_name CHAR(64) NOT NULL,
    PRIMARY KEY (id)
);

/* Create Relationship Types */

CREATE TABLE IF NOT EXISTS sells (
    seller_id INT NOT NULL,
    item_id INT NOT NULL,
    price DECIMAL(6,2) NOT NULL,
    stock INT NOT NULL,
    PRIMARY KEY (seller_id, item_id),
    FOREIGN KEY (seller_id)
        REFERENCES seller(id)
        ON DELETE CASCADE,
    FOREIGN KEY (item_id)
        REFERENCES item(id)
        ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS purchase (
    purchase_id INT NOT NULL AUTO_INCREMENT,
    customer_id INT NOT NULL,
    item_id INT NOT NULL,
    quantity TINYINT UNSIGNED NOT NULL,
    total_cost DECIMAL(7,2) NOT NULL,
    seller_id INT NOT NULL,
    purchase_date DATE NOT NULL,
    address_id INT NOT NULL,
    card_number CHAR(4) NOT NULL,   -- last 4 digits
    card_expiry_date DATE NOT NULL,
    PRIMARY KEY (purchase_id),
    FOREIGN KEY (customer_id)
        REFERENCES customer(id)
        ON UPDATE CASCADE
        ON DELETE NO ACTION,         -- maintain records
    FOREIGN KEY (item_id)
        REFERENCES item(id)
        ON UPDATE CASCADE
        ON DELETE NO ACTION,         -- maintain records
    FOREIGN KEY (seller_id)
        REFERENCES seller(id)
        ON UPDATE CASCADE
        ON DELETE NO ACTION          -- maintain records
);

CREATE TABLE IF NOT EXISTS shippedto (
    shipment_id INT NOT NULL AUTO_INCREMENT,
    item_id INT NOT NULL,
    customer_id INT NOT NULL,
    purchase_id INT NOT NULL,
    address_id INT NOT NULL,
    carrier_id INT NOT NULL,
    tracking_number CHAR(64) NOT NULL,
    process_date DATE NOT NULL,
    arrival_date DATE,
    shipping_fee DECIMAL(5,2),
    PRIMARY KEY (shipment_id),
    FOREIGN KEY (item_id)
        REFERENCES item(id)
        ON UPDATE CASCADE
        ON DELETE NO ACTION,         -- maintain records
    FOREIGN KEY (customer_id)
        REFERENCES customer(id)
        ON UPDATE CASCADE
        ON DELETE NO ACTION,        -- maintain records
    FOREIGN KEY (purchase_id)
        REFERENCES purchase(purchase_id)
        ON UPDATE CASCADE
        ON DELETE NO ACTION,        -- maintain records
    FOREIGN KEY (address_id)
        REFERENCES address(id)
        ON UPDATE CASCADE
        ON DELETE NO ACTION,        -- maintain records
    FOREIGN KEY (carrier_id)
        REFERENCES carrier(id)
        ON UPDATE CASCADE
        ON DELETE NO ACTION         -- maintain records
);

CREATE TABLE IF NOT EXISTS reviews (
    customer_id INT NOT NULL,
    item_id INT NOT NULL,
    seller_id INT NOT NULL,
    review_text CHAR(128) NOT NULL,        
    write_date DATE NOT NULL,
        /* limit each customer to 1 review per item,seller */
    PRIMARY KEY (customer_id, item_id, seller_id),
    FOREIGN KEY (customer_id)
        REFERENCES customer(id)
        ON UPDATE CASCADE
        ON DELETE NO ACTION,        -- maintain records
    FOREIGN KEY (item_id)
        REFERENCES item(id)
        ON UPDATE CASCADE
        ON DELETE NO ACTION,         -- maintain records
    FOREIGN KEY (seller_id)
        REFERENCES seller(id)
        ON UPDATE CASCADE
        ON DELETE NO ACTION          -- maintain records
);