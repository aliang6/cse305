import React, { Component } from 'react';

import constants from '../constants';
import './css/Cart.css';

import CartItem from './Item/CartItem';

export default class Cart extends Component {
    constructor(props) {
        super(props)

        this.state = {
            items: null,
            address_type: '0',
            address_1: '',
            address_2: '',
            apt: '',
            city: '',
            zip: '',
            addresses: null,
            selected_address: '',
            card_number: '',
            card_expiry_date: '',
        };

        this.handleInputChange = this.handleInputChange.bind(this);
        this.retrieveCart = this.retrieveCart.bind(this);
        this.purchaseItems = this.purchaseItems.bind(this);
        this.addAddress = this.addAddress.bind(this);
        this.retrieveAddresses = this.retrieveAddresses.bind(this);
    }

    componentWillMount() {
        this.retrieveCart();
        this.retrieveAddresses();
    }

    handleInputChange(event) {
        const target = event.target;
        const name = target.name;
        const value = target.value;

        this.setState({
            [name]: value,
        });
    }

    async retrieveCart() {
        try {
            let body = {
                customer_id: this.props.customer_id,
            };
            let response = await fetch(constants.API.hostname + '/getcart', {
                method: 'POST',
                headers: { 'Content-Type':'application/json' },
                body: JSON.stringify(body),
            });

            const json = await response.json(); 
            console.log(json);

            this.setState({
                items: json.items,
            });
        } catch(err) {
            console.log(err);
        }
    }

    async purchaseItems(event) {
        event.preventDefault();
        try {
            let body = {
                customer_id: this.props.customer_id,
                address_id: this.state.selected_address,
                card_number: this.state.card_number,
                card_expiry_date: this.state.card_expiry_date,
            };
            console.log(body);
            let response = await fetch(constants.API.hostname + '/purchase', {
                method: 'POST',
                headers: { 'Content-Type':'application/json' },
                body: JSON.stringify(body),
            });

            await response.json(); 

            this.setState({
                items: [],
            });
        } catch(err) {
            console.log(err);
        }
    }

    async addAddress(event) {
        event.preventDefault();
        try {
            let body = {
                customer_id: this.props.customer_id,
                address_type: this.state.address_type,
                address1: this.state.address_1,
                address2: this.state.address_2,
                apt: this.state.apt,
                city: this.state.city,
                zip: this.state.zip,
            };
            console.log(body);
            let response = await fetch(constants.API.hostname + '/addaddress', {
                method: 'POST',
                headers: { 'Content-Type':'application/json' },
                body: JSON.stringify(body),
            });

            let json = await response.json(); 
            await this.retrieveAddresses();
            alert("Address added");
        } catch(err) {
            console.log(err);
        }
    }

    async retrieveAddresses() {
        try {
            let body = {
                customer_id: this.props.customer_id,
            };
            let response = await fetch(constants.API.hostname + '/getaddresses', {
                method: 'POST',
                headers: { 'Content-Type':'application/json' },
                body: JSON.stringify(body),
            });

            let json = await response.json(); 
            this.setState({
                addresses: json.addresses,
                selected_address: json.addresses[0] ? json.addresses[0] : null,
            });
        } catch(err) {
            console.log(err);
        }
    }

    render() {
        return(
            <div className="cart">
                <div className="cart-items">
                    <h2>{this.props.customer_name + "'s Cart"}</h2>
                    {this.state.items && this.state.items.length === 0 && <h3>Empty cart</h3>}
                    {this.state.items && this.state.items.map(item => (
                        <CartItem
                            customer_id = { this.props.customer_id }
                            item_id = { item.id }
                            item_name = { item.item_name }
                            item_type = { item.category }
                            item_desc = { item.item_description }
                            item_price = { item.price }
                            item_stock = { item.stock }
                            quantity = { item.quantity }
                            retrieveCart = { this.retrieveCart }
                            key = { item.id }
                        />
                    ))}
                </div>
                <div className="purchase-section">
                    <h3>Add Address</h3>
                    <form className="add-address-form" onSubmit={this.addAddress}>
                        <label>
                            Address Type:
                            <select name="address_type" value={this.state.address_type} onChange={this.handleInputChange}>
                                <option type="number" value="0">Billing</option>
                                <option type="number" value="1">Shipping</option>
                            </select>
                        </label>
                        <label>
                            Address 1:
                            <input 
                                type = "text"
                                name = "address_1" 
                                value = { this.state.address_1 }
                                onChange = { this.handleInputChange }
                            />
                        </label>
                        <label>
                            Address 2:
                            <input 
                                type = "text"
                                name = "address_2" 
                                value = { this.state.address_2 }
                                onChange = { this.handleInputChange }
                            />
                        </label>
                        <label>
                            Apartment:
                            <input 
                                type = "text"
                                name = "apt" 
                                value = { this.state.apt }
                                onChange = { this.handleInputChange }
                            />
                        </label>
                        <label>
                            City:
                            <input 
                                type = "text"
                                name = "city" 
                                value = { this.state.city }
                                onChange = { this.handleInputChange }
                            />
                        </label>
                        <label>
                            Zipcode:
                            <input 
                                type = "number"
                                name = "zip" 
                                value = { this.state.zip }
                                onChange = { this.handleInputChange }
                            />
                        </label>
                        <input type="submit" value="Submit" />
                    </form>

                    <h3>Purchase Item: </h3>
                    <form className="purchase-form" onSubmit={this.purchaseItems}>
                        <label>
                            Address:
                            <select name="selected_address" value={this.state.selected_address} onChange={this.handleInputChange}>
                                {this.state.addresses && this.state.addresses.length !== 0 && this.state.addresses.map(address => (
                                    <option type="number" value={address.id} key={address.id}>{address.address1 + " "} {address.address2 !== null && address.address2 + " "}</option>
                                ))}
                            </select>
                        </label>
                        <label>
                            Card Number:
                            <input 
                                type = "number"
                                name = "card_number" 
                                value = { this.state.card_number }
                                onChange = { this.handleInputChange }
                            />
                        </label>
                        <label>
                            Card Expiration Date (yyyy-mm-dd):
                            <input 
                                type = "text"
                                name = "card_expiry_date" 
                                value = { this.state.card_expiry_date }
                                onChange = { this.handleInputChange }
                            />
                        </label>
                        {this.state.addresses && this.state.addresses.length === 0 && <div>Need at least one address before you can purchase</div>}
                        {this.state.addresses && this.state.addresses.length !== 0 && <input type="submit" value="Purchase items" />}
                    </form>
                </div>
            </div>
            
            
        );
    }
}