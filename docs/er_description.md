# E-Commerce: ER Diagram

### Andy Liang (111008856)

### Johnny So (111158276)



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

* `Item`
  * **ItemId** - unique internal identifier of each Item
  * `Type` - category of the Item
    * e.g. electronics, office supplies, or kitchen utensils
  * `ItemName` - name of the Item
  * `ItemDescription` - description of the Item
* `Seller`
  * **SellerId** - unique internal identifier of each Seller
  * `SellerName` - name of the Seller
* `Customer`
  * **CustomerId** - unique internal identifier of each Customer
  * `FirstName` - first name of the Customer
  * `LastName` - last name of the Customer
  * *Email* - email of the Customer
  * `Phone` - phone number of the Customer
  * <u>BillingAddress</u> - billing addresses of the Customer
  * <u>ShippingAddress</u> - shipping addresses of the Customer
* `ShoppingCart`
  * ~~**CustomerId**~~ (FK ref `Customer(CustomerId)`) - unique internal identifier for the `Customer` to which the `ShoppingCart` instance belongs
    * This is not labeled in the ER diagram as this attribute has more to do with how we transform a weak entity from an ER diagram to SQL.
  * **ItemId** (FK ref `Item(ItemId)`) - unique internal identifier for each `Item` in a `ShoppingCart`
  * `Quantity` - number of Items with the id `ItemId` in a `ShoppingCart`
* `Carrier`
  * **CarrierId** - unique internal identifier of each `Carrier`
  * `Name` - name of the `Carrier`

#### Relationship Types

The relationship types below are in the format `V (E1, E2)` where `V` is the verb that describes the relationship and `E1, E2` are the two entities connected by `V`. The name of the relationship `V` was chosen such that `V (E1, E2)` can be read as `E1 V E2`. 

​	The **key** is specified at the end of each list underneath the relationship type. The minimum roles and attributes that comprise the **key** of the relationship type are in **boldface** and are specified under its attributes. 

​	**Boldfaced relationship types** indicate they are a ternary relationship. 

​	*Italicized relationship types* indicate they are weak/identifying relationships.

​	<u>Note</u>: If an entity type A is within the key of a relationship type B, it means that the primary key (PK) of B includes the PK of A.

* `Sells` (**Seller**, **Item**)

  * <u>Cardinality</u>: `Seller 1...*, Item 1...*`
    * A `Seller` must sell at least one item, and an `Item` is sold by at least one `Seller`
  * `Price` - the price (in USD) that the `Seller` charges for the specified `Item`
  * `Stock` - the amount that the `Seller` has in stock of the `Item`
  * **Key** - `Seller`, `Item`

* `Purchase` (**Customer**, **Item**)

  * <u>Cardinality</u>: `Customer 0...1, Item 0...*`

    * A `Customer` can exist without buying anything and only up to one `Customer` can be related to a `Purchase` relationship
    * An `Item` can similarly exist without being bought, and technically infinite `Item`s can be bought in one `Purchase` relationship

  * **PurchaseId** - unique internal identifier of the purchase

  * `SellerId` - which seller the `Customer` purchased the `Item` from

  * `Address` - which billing address of the `Customer`

  * `CardNumber` - card number

  * `CardExpiryDate` - card expiry date

  * `Quantity` - amount purchased

  * `ItemTotal` - the total amount paid for the specified `Item` (includes calculation of quantity * `ItemId`'s price and tax)

  * `PurchaseDate` - the date the item was purchased

  * **Key** - `Customer`, `Item`, `PurchaseId`

    <u>Note</u>: for payments, we are restricting the payment type to be strictly credit/debit cards in this ER diagram design. Specific vendors such as PayPal can be added, but if support for multiple  such vendors is to be added, a different entity type such as `PaymentVendor` might have to be added.

* **Shipments** (**Carrier**, **Item**, **Customer**)

  ​	A ternary relationship amongst `Carrier`, `Item` and `Customer` with the help of three binary relationships.

  * `Delivers` (**Carrier**, **Shipments**)
  * `PackagedIn` (**Item**, **Shipments**)
  * `DeliveredTo` (**Shipments**, **Customer**)

  * **ShipmentId** - unique internal identifier of the shipment
  * PurchaseId (FK ref Purchase(Id)) - unique internal identifier of the purchase transaction to which this shipment corresponds
  * `Carrier` - the carrier delivering the shipment
  * `TrackingNumber` - the carrier's tracking number of the shipment
  * `ShippingFee` - associated shipping/delivery fees (in USD)
  * `Address` - which shipping address of the Customer
  * `ProcessDate` - when the shipment is first processed and sent out for delivery
  * `ArrivalDate` - when the shipment arrives to the `Customer`
  * **Key** - `Item`, `Customer`, `ShipmentId`

* `Reviews` (**Customer**, **Item**)

  - <u>Cardinality</u>: `Customer 0...1, Item 0...*`
    - Same reasoning as the ``Purchase` relationship cardinality

  * **ReviewId** - unique internal identifier of the `Review`
  * `Text` - written review of the Item left by the `Customer`
  * `SellerId` - the ID of the `Seller` who provided the `Item` that was sold to the `Customer`
  * `WriteDate` - date the review was written
  * **Key** - `Customer`, `Item`, `ReviewId`
  * <u>Note</u>: we add support for the Customer to review a specific `Item, Seller` combo instead of just `Item`

* *Has* (**Customer**, `ShoppingCart`)

  * A `ShoppingCart` is a weak entity because it cannot exist without a corresponding associated `Customer`
  * In addition, there is a one-to-one correspondence (single-role key constraint and participation constraint) between a `Customer` and a `ShoppingCart`.
  * **Key** - `Customer`

* `Contains` (`ShoppingCart`, **Item**)

  * A `ShoppingCart` will contain `Item`s 
  * **Key** - `ShoppingCart`,`Item`



