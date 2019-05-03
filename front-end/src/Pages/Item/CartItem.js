import React, { Component } from 'react';
import './Item.css';

import constants from '../../constants';

export default class CartItem extends Component {
    constructor(props){
        super(props);

        this.state = {
            quantity: this.props.quantity,
            update_quantity: this.props.quantity,
            total_price: this.props.quantity * this.props.item_price,
        };

        this.handleInputChange = this.handleInputChange.bind(this);
        this.updateQuantity = this.updateQuantity.bind(this);
        this.removeFromCart = this.removeFromCart.bind(this);
    }

    handleInputChange(event) {
        const target = event.target;
        const name = target.name;
        const value = target.value;

        this.setState({
            [name]: value
        });
    }

    async updateQuantity(event){
        event.preventDefault();
        try {
            let quantity = (this.state.quantity > this.props.item_stock) ? this.props.item_stock : this.state.quantity;
            let body = {
                customer_id: this.props.customer_id,
                item_id: this.props.item_id,
                quantity: quantity,
            }
            const response = await fetch(constants.API.hostname + '/addtocart', {
                method: 'POST',
                headers: { 'Content-Type':'application/json' },
                body: JSON.stringify(body),
            });
            await response.json(); 
            this.setState({
                quantity: this.state.update_quantity,
                total_price: this.state.update_quantity * this.props.item_price,
            })
            alert(this.props.item_name + " quantity updated")
        } catch(err) {
            console.log(err);
        }
    }

    async removeFromCart() {
        try {
            let body = {
                customer_id: this.props.customer_id,
                item_id: this.props.item_id,
            }
            let response = await fetch(constants.API.hostname + '/removecartitem', {
                method: 'POST',
                headers: { 'Content-Type':'application/json' },
                body: JSON.stringify(body),
            });

            await response.json(); 
            this.props.retrieveCart();
            alert(this.props.item_name + " removed from cart");
        } catch(err) {
            console.log(err);
        }
    }

    render() {
        return(
            <div className='item'>
                <div className='item-name'>Name: { this.props.item_name }</div>
                <div className='item-type'>Type: { this.props.item_type }</div>
                <div className='item-desc'>Description: { this.props.item_desc }</div>
                <div className='item-desc'>Quantity: { this.state.quantity }</div>
                <div className='item-desc'>Total price: { this.state.total_price }</div>
                <form onSubmit={ this.updateQuantity }>
                    <input
                        type = "number"
                        name = "update_quantity"
                        value = { this.state.update_quantity }
                        onChange = { this.handleInputChange }
                    />
                    <input type="submit" value="Change quantity" />
                </form>
                <button onClick={ this.removeFromCart }>Remove from cart</button>
            </div>
        );
    }
}
