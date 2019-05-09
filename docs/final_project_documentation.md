# CSE 305 Final Project

### Andy Liang (111008856), Johnny So (111158276)



## ER Diagram

### E-Commerce System Project, ER Diagram

The ER diagram was made with ERDPlus, a free online tool for making ER diagrams. Cardinality is shown using Crow's Foot notation, but relationships and such are shown using Chen style.

#### Entity Types

The specifications of the entity types in the ER diagram are listed below. Any assumptions made about the design is also specified.

For each entity type listed, the attributes appear below it. 

​	**Bold attributes** indicate that it will be used as part of the primary key for the entity type.

​	*Italicized attributes* indicate they are part of a candidate key for the entity type (should be unique per entity).

​	<u>Underlined attributes</u> indicate they are set/multi-valued.

​	~~Strikethrough attributes~~ indicate they are not actually in the ER diagram but will be in the SQL relations.

​	Attributes with a (FK ref `A(B)`) indicates that it is a foreign key that references entity type/relation A's attribute B.

​	`Attributes like this` are none of the above.

- `Item`
  - **ItemId** - unique internal identifier of each Item
  - `Type` - category of the Item
    - e.g. electronics, office supplies, or kitchen utensils
  - `ItemName` - name of the Item
  - `ItemDescription` - description of the Item
- `Seller`
  - **SellerId** - unique internal identifier of each Seller
  - `SellerName` - name of the Seller
- `Customer`
  - **CustomerId** - unique internal identifier of each Customer
  - `FirstName` - first name of the Customer
  - `LastName` - last name of the Customer
  - *Email* - email of the Customer
  - `Phone` - phone number of the Customer
  - <u>BillingAddress</u> - billing addresses of the Customer
  - <u>ShippingAddress</u> - shipping addresses of the Customer
- `ShoppingCart`
  - ~~**CustomerId**~~ (FK ref `Customer(CustomerId)`) - unique internal identifier for the `Customer` to which the `ShoppingCart` instance belongs
    - This is not labeled in the ER diagram as this attribute has more to do with how we transform a weak entity from an ER diagram to SQL.
  - **ItemId** (FK ref `Item(ItemId)`) - unique internal identifier for each `Item` in a `ShoppingCart`
  - `Quantity` - number of Items with the id `ItemId` in a `ShoppingCart`
- `Carrier`
  - **CarrierId** - unique internal identifier of each `Carrier`
  - `Name` - name of the `Carrier`

#### Relationship Types

The relationship types below are in the format `V (E1, E2)` where `V` is the verb that describes the relationship and `E1, E2` are the two entities connected by `V`. The name of the relationship `V` was chosen such that `V (E1, E2)` can be read as `E1 V E2`. 

​	The **key** is specified at the end of each list underneath the relationship type. The minimum roles and attributes that comprise the **key** of the relationship type are in **boldface** and are specified under its attributes. 

​	**Boldfaced relationship types** indicate they are a ternary relationship. 

​	*Italicized relationship types* indicate they are weak/identifying relationships.

​	<u>Note</u>: If an entity type A is within the key of a relationship type B, it means that the primary key (PK) of B includes the PK of A.

- `Sells` (**Seller**, **Item**)

  - <u>Cardinality</u>: `Seller 1...*, Item 1...*`
    - A `Seller` must sell at least one item, and an `Item` is sold by at least one `Seller`
  - `Price` - the price (in USD) that the `Seller` charges for the specified `Item`
  - `Stock` - the amount that the `Seller` has in stock of the `Item`
  - **Key** - `Seller`, `Item`

- `Purchase` (**Customer**, **Item**)

  - <u>Cardinality</u>: `Customer 0...1, Item 0...*`

    - A `Customer` can exist without buying anything and only up to one `Customer` can be related to a `Purchase` relationship
    - An `Item` can similarly exist without being bought, and technically infinite `Item`s can be bought in one `Purchase` relationship

  - **PurchaseId** - unique internal identifier of the purchase

  - `SellerId` - which seller the `Customer` purchased the `Item` from

  - `Address` - which billing address of the `Customer`

  - `CardNumber` - card number

  - `CardExpiryDate` - card expiry date

  - `Quantity` - amount purchased

  - `ItemTotal` - the total amount paid for the specified `Item` (includes calculation of quantity * `ItemId`'s price and tax)

  - `PurchaseDate` - the date the item was purchased

  - **Key** - `Customer`, `Item`, `PurchaseId`

    <u>Note</u>: for payments, we are restricting the payment type to be strictly credit/debit cards in this ER diagram design. Specific vendors such as PayPal can be added, but if support for multiple  such vendors is to be added, a different entity type such as `PaymentVendor` might have to be added.

- **Shipments** (**Carrier**, **Item**, **Customer**)

  ​	A ternary relationship amongst `Carrier`, `Item` and `Customer` with the help of three binary relationships.

  - `Delivers` (**Carrier**, **Shipments**)
  - `PackagedIn` (**Item**, **Shipments**)
  - `DeliveredTo` (**Shipments**, **Customer**)
  - **ShipmentId** - unique internal identifier of the shipment
  - PurchaseId (FK ref Purchase(Id)) - unique internal identifier of the purchase transaction to which this shipment corresponds
  - `Carrier` - the carrier delivering the shipment
  - `TrackingNumber` - the carrier's tracking number of the shipment
  - `ShippingFee` - associated shipping/delivery fees (in USD)
  - `Address` - which shipping address of the Customer
  - `ProcessDate` - when the shipment is first processed and sent out for delivery
  - `ArrivalDate` - when the shipment arrives to the `Customer`
  - **Key** - `Item`, `Customer`, `ShipmentId`

- `Reviews` (**Customer**, **Item**)

  - <u>Cardinality</u>: `Customer 0...1, Item 0...*`
    - Same reasoning as the ``Purchase` relationship cardinality

  - **ReviewId** - unique internal identifier of the `Review`
  - `Text` - written review of the Item left by the `Customer`
  - `SellerId` - the ID of the `Seller` who provided the `Item` that was sold to the `Customer`
  - `WriteDate` - date the review was written
  - **Key** - `Customer`, `Item`, `ReviewId`
  - <u>Note</u>: we add support for the Customer to review a specific `Item, Seller` combo instead of just `Item`

- *Has* (**Customer**, `ShoppingCart`)

  - A `ShoppingCart` is a weak entity because it cannot exist without a corresponding associated `Customer`
  - In addition, there is a one-to-one correspondence (single-role key constraint and participation constraint) between a `Customer` and a `ShoppingCart`.
  - **Key** - `Customer`

- `Contains` (`ShoppingCart`, **Item**)

  - A `ShoppingCart` will contain `Item`s 
  - **Key** - `ShoppingCart`,`Item`



## ER Diagram to SQL Mapping Report

### Entity Tables:

​	Most `id` fields are described with `AUTO_INCREMENT` so MySQL will handle the generation of them without the application having to worry about assigning IDs to rows.

​	<u>Note</u>: some text fields such as `X_name, X_description` are currently limited in length for now. We may impose a hard limit as is currently done in `create_tables.sql` for the final product as it's reasonable to keep certain fields to a certain length. For example, if you are a seller, you would want to keep your item name somewhat short otherwise it'll look intimidating to potential customers. However, we would have to figure out what the length of such fields should be.

- ### Item

  - An easy one-to-one mapping from the ER diagram to a MySQL relation.
  - Attributes
    - `id`
    - `item_name`
    - `item_description`
  - Constraints
    - `PRIMARY KEY (id)`

- ### Seller

  - Another easy mapping from the ER diagram to a MySQL relation.
  - Attributes
    - `id` 
    - `seller_name`
    - `seller_description`
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
    - `PRIMARY KEY (customer_id, item_id, seller_id)`
    - `FOREIGN KEY (customer_id) REFERENCES customer(id)`
    - `FOREIGN KEY (item_id) REFERENCES item(id)`
    - `FOREIGN KEY (seller_id) REFERENCES seller(id)`
  - Notes
    - We limit each `Customer` to 1 review per `(Item,Seller)` tuple with the specified Primary Key. If needed, the `Customer` can edit his/her review, but not post a million reviews for one specific `(Item,Seller)` to reduce spam.



## Implemented Transactions

### Create

- Add a customer

  - ```sql
    INSERT INTO customer 
    (id, first_name, last_name, email, phone) 
    VALUES 
    (?,?,?,?,?,?);
    ```

- Add a seller

  - ```sql
    INSERT INTO seller 
    (id, seller_name, seller_description) 
    VALUES 
    (?,?,?);
    ```

- Add an item listing

  - ```sql
    INSERT INTO item 
    (id, item_name, item_description, category) 
    VALUES 
    (?,?,?,?);
    
    INSERT INTO sells 
    (seller_id, item_id, price, stock) 
    VALUES 
    (?,?,?,?);
    ```

- Add to a customer's shopping cart

  - ```sql
    INSERT INTO shoppingcart 
    (customer_id, item_id, quantity) 
    VALUES 
    (?,?,?);
    ```

- Add to a customer's addresses

  - ```sql
    INSERT INTO address 
    (customer_id, id, address_type, address1, address2, apt, city, zip) 
    VALUES 
    (?,?,?,?,?,?,?,?);
    ```

- Add to a customer's purchases

  - ```sql
    INSERT INTO purchase
    (purchase_id, customer_id, item_id, quantity, total_cost, seller_id, purchase_date, address_id, card_number, card_expiry_date)
    VALUES (?,?,?,?,?,?,?,?,?,?);
    ```

- Add to a customer's shipments

  - ```sql
    INSERT INTO shippedto
    (shipment_id, item_id, customer_id, purchase_id, address_id, carrier_id, tracking_number, process_date, arrival_date, shipping_fee)
    VALUES (?,?,?,?,?,?,?,?,?,?);
    ```

### Retrieve

- Retrieve all items

  - ```sql
    SELECT item.id, item.item_name, item.item_description, item.category, sells.price, sells.stock
    FROM item 
    RIGHT JOIN sells ON item.id = sells.item_id;
    ```

- Retrieve all items that match a search query

  - ```sql
    SELECT item.id, item.item_name, item.item_description, item_type.category, sells.price, sells.stock
    FROM item 
    RIGHT JOIN sells ON item.id = sells.item_id
    JOIN item_type ON item.category = item_type.id
    WHERE item_name OR item_description LIKE ?
    ```

- Retrieve all sellers

  - ```sql
    SELECT *
    FROM seller;
    ```

- Retrieve all items sold by a seller

  - ```sql
    SELECT item.id, item.item_name, item.item_description, item.category, sells.price, sells.stock
    FROM item
    RIGHT JOIN sells ON item.id = sells.item_id
    WHERE sells.seller_id = ?;
    ```

- Retrieve attributes of a customer

  - ```sql
    SELECT id, first_name, last_name
    FROM customer 
    WHERE email=?;
    ```

- Retrieve attributes of a customer's shopping cart

  - ```sql
    SELECT id, quantity, item_name, item_description, category, price
    FROM shoppingcart 
    JOIN item ON shoppingcart.item_id = item.id 
    JOIN sells ON shoppingcart.item_id = sells.item_id 
    WHERE customer_id=?;
    ```

- Retrieve all of a customer's billing addresses

  - ```sql
    SELECT * 
    FROM address 
    WHERE customer_id=? AND address_type=0;
    ```

- Retreive all of a customer's purchases

  - ```sql
    SELECT purchase.purchase_id, purchase.purchase_date, purchase.card_number, purchase.quantity, address.address1, address.address2, seller.seller_name, item.item_name, sells.price
    FROM purchase 
    JOIN item ON purchase.item_id = item.id 
    JOIN sells ON sells.item_id = item.id 
    JOIN seller ON sells.seller_id = seller.id
    JOIN address ON 
    	purchase.customer_id = address.customer_id AND 
    	purchase.address_id = address.id
    WHERE purchase.customer_id=?;
    ```

- Retrieve all of a customer's shipments

  - ```sql
    SELECT shipment.shipment_id, shipment.tracking_number, shipment.process_date, shipment.arrival_date, shipment.shipping_fee, item.item_name, carrier.carrier_name, address.address1, address.address2
    FROM shipment
    JOIN item ON shipment.item_id = item.id 
    JOIN carrier ON shipment.carrier_id = carrier.id
    JOIN address ON 
    shipment.customer_id = address.customer_id AND 
    shipment.address_id = address.id
    WHERE shipment.customer_id=?;
    ```

### Update

- Update attributes of a seller's item

  - ```sql
    SELECT *
    FROM sells
    WHERE seller_id=? AND item_id=?;
    ```

- Update item's stock after a purchase

  - ```sql
    UPDATE sells
    SET stock=?
    WHERE item_id=? AND seller_id=?;
    ```

- Update item's quantity in a customer's shopping cart

  - ```sql
    UPDATE shoppingcart
    SET quantity=?
    WHERE customer_id=? AND item_id=?;
    ```

### Delete

- Remove item from a shopping cart

  - ```sql
    DELETE FROM shoppingcart 
    WHERE customer_id=? AND item_id=?;
    ```

- Remove all items from a shopping cart after a purchase

  - ```sql
    DELETE FROM shoppingcart 
    WHERE customer_id=?;
    ```

- Remove an item listing

  - ```sql
    DELETE FROM sells
    WHERE seller_id=? AND item_id=?;
    
    DELETE FROM item
    WHERE id=?;
    ```