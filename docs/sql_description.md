# E-Commerce: SQL Mapping

### Andy Liang (111008856)

### Johnny So (111158276)



## Description

This document describes the reasoning behind the mapping from the ER diagram to the MySQL relations.

The other files such as `create_tables.sql, populate_tables.sql` are the scripts used in creating the tables and populating them with fake data.

The `.csv` files have a small sample of mock data used by`populate_tables.sql` .



## ER Diagram to SQL Mapping Report

### Entity Tables:

​	Most `id` fields are described with `AUTO_INCREMENT` so MySQL will handle the generation of them without the application having to worry about assigning IDs to rows.

​	<u>Note</u>: some text fields such as `X_name, X_description` are currently limited in length for now. We may impose a hard limit as is currently done in `create_tables.sql` for the final product as it's reasonable to keep certain fields to a certain length. For example, if you are a seller, you would want to keep your item name somewhat short otherwise it'll look intimidating to potential customers. However, we would have to figure out what the length of such fields should be.

- ### ItemType

  - To ensure that the type of an item is within a valid list of types.
  - Attributes
  - `id`
    - `category`
  - Constraints
    - `PRIMARY KEY (id)`
  
- ### Item

  - An easy one-to-one mapping from the ER diagram to a MySQL relation.
  - Attributes
    - `id`
    - `item_name`
    - `category`
    - `item_description`
  - Constraints
    - `PRIMARY KEY (id)`
    - `FOREIGN KEY (category) REFERENCES ItemType(id)`

- ### Seller

  - Another easy mapping from the ER diagram to a MySQL relation.
  - Attributes
    - `id` 
    - `seller_name`
    - `seller_description`
    - `pwd`
  - Constraints
    - `PRIMARY KEY (id)`

- ### Customer

  - Mapping this from the ER diagram took some additional consideration.
  - Attributes
    - `id`
    - `first_name`
    - `last_name`
    - `email`
    - `phone`
    - `pwd`
  - Constraints
    - `PRIMARY KEY (id)`
  - Notes
    - the set-valued `Address` attribute was moved into a different relation as a `Customer` could potentially have an unlimited number of addresses

- ### Address

  - The set-valued attribute `Address` that belonged to `Customer` in the ER diagram.
  - Attributes
    - `customer_id`
    - `id`
    - `address_type` - `0` for billing, `1` for shipping
    - `address1`
    - `address2`
    - `apt`
    - `city`
    - `zip`
  - Constraints
    - `PRIMARY KEY (id)`
    - `FOREIGN KEY (customer_id) REFERENCES customer(id)`
  - Notes
    - This allows a `Customer` to have as many addresses as he wants.

- ### ShoppingCart

  - The weak-entity that depended on a `Customer` entity.
  - Attributes
    - `customer_id`
    - `item_id`
    - `quantity`
  - Constraints
    - `PRIMARY KEY (customer_id, item_id)`
    - `FOREIGN KEY (customer_id) REFERENCES customer(id)`
    - `FOREIGN KEY (item_id) REFERENCES item(id)`
  - Notes
    - A row in the `ShoppingCart` relation is identified by which `Customer`'s shopping cart it is referring to and what `Item` is currently in the cart. Hence, if there are 5 `Item`s in a `Customer`'s shopping cart, there will be 5 rows that represent this.

- ### Carrier

  - An easy one-to-one mapping from the ER diagram to the MySQL relation.
  - Attributes
    - `id`
    - `carrier_name`
  - Constraints
    - `PRIMARY KEY (id)`

### Relationship Tables

As these relations represent Relationships from the ER diagram, they must include a key (we made them the PK) from each entity type they connect.

- ### Sells

  - The relation that represents the `Sells(Seller,Item)` relationship from the ER diagram.
  - Attributes
    - `seller_id`
    - `item_id`
    - `price`
    - `stock` - the quantity that the `Seller` has in stock
  - Constraints
    - `PRIMARY KEY (seller_id, item_id)`
    - `FOREIGN KEY (seller_id) REFERENCES seller(id)`
    - `FOREIGN KEY (item_id) REFERENCES item(id)`

- ### Purchase

  - Represents the `Bought(Customer,Item)` relationship from the ER diagram.
  - Attributes
    - `purchase_id`
    - `customer_id`
    - `item_id`
    - `quantity`
    - `total_cost` - we need to save this as the price of an `Item` may change (we can calculate the price when it was purchased with `total_cost` and `quantity` if needed)
    - `seller_id` - needed as an `Item` can be bought from different sellers
    - `purchase_date`
    - `address_id`
    - `card_number` - the last 4 digits of the card number
    - `card_expiry_date`
  - Constraints
    - `PRIMARY KEY (purchase_id)`
    - `FOREIGN KEY (customer_id) REFERENCES customer(id)`
    - `FOREIGN KEY (item_id) REFERENCES item(id)`
    - `FOREIGN KEY (seller_id) REFERENCES seller(id)`
  - Notes
    - For the Foreign Key constraints in this relation, we specify `ON UPDATE CASCADE ON DELETE NO ACTION` to maintain records.
      - If an `id` changes, we want the `id` to match.
      - if an entity is deleted, we probably still want to keep the record there for consistency.
        - For example, if a `Seller` deletes his account, we don't want to delete the row in `Purchase`. Otherwise, the `Customer` loses records of his purchase.

- ### Shipments

  - Attributes
    - `shipment_id`
    - `item_id`
    - `customer_id`
    - `purchase_id`
    - `address_id`
    - `carrier_id`
    - `tracking_number`
    - `process_date`
    - `arrival_date`
    - `shipping_fee`
  - Constraints
    - `PRIMARY KEY (shipment_id)`
    - `FOREIGN KEY (item_id) REFERENCES item(id)`
    - `FOREIGN KEY (customer_id) REFERENCES customer(id)`
    - `FOREIGN KEY (purchase_id) REFERENCES purchase(purchase_id)`
    - `FOREIGN KEY (address_id) REFERENCES address(id)`
    - `FOREIGN KEY (carrier_id) REFERENCES carrier(id)`
  - Notes
    - We have the same policies on all the FK constraints as we do in `Purchase` for the same reason.

- ### Reviews

  - Attributes
    - `customer_id`
    - `item_id`
    - `seller_id`
    - `review_text`
    - `write_date`
  - Constraints
    - `PRIMARY KEY (customer_id, item_id)`
    - `FOREIGN KEY (customer_id) REFERENCES customer(id)`
    - `FOREIGN KEY (item_id) REFERENCES item(id)`
    - `FOREIGN KEY (seller_id) REFERENCES seller(id)`
  - Notes
    - We limit each `Customer` to 1 review per `Item` . If needed, the `Customer` can edit his/her review, but not post a million reviews for one specific `Item` to reduce spam.