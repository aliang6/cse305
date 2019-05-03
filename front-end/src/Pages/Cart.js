import React, { Component } from 'react';

import constants from '../constants';
import './css/Cart.css';

import CartItem from './Item/CartItem';

export default class Cart extends Component {
    constructor(props) {
        super(props)

        this.state = {
            items: null,
        };

        this.retrieveCart = this.retrieveCart.bind(this);
        this.purchaseItems = this.purchaseItems.bind(this);
    }

    componentWillMount() {
        this.retrieveCart();
    }

    async retrieveCart() {
        try {
            let body = {
                customer_id: this.props.customer_id,
            }
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

    async purchaseItems() {
        try {
            let body = {
                customer_id: this.props.customer_id,
            }
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

    render() {
        return(
            <div className="cart">
                <h2>{this.props.customer_name + "'s Cart"}</h2>
                {this.state.items && this.state.items.length === 0 && <h3>Empty cart</h3>}
                <div className="cart-items">
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
                <button onClick={ this.purchaseItems } >Purchase items</button>
            </div>
            
            
        );
    }
}