# E-Commerce: Transactions

### Andy Liang (111008856)

### Johnny So (111158276)



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

- Retrieve all of a customer's purchases

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