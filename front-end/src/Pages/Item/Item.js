import React, { Component } from 'react';
import './Item.css';

import constants from '../../constants';

export default class Item extends Component {
    constructor(props){
        super(props);

        this.state = {
            quantity: 1,
        }

        this.addToCart = this.addToCart.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
    }

    handleInputChange(event) {
        const target = event.target;
        const name = target.name;
        const value = target.value;

        this.setState({
            [name]: value
        });
    }


    async addToCart(event){
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
            alert(this.props.item_name + " added to cart")
        } catch(err) {
            console.log(err);
        }
    }

    render() {
        return(
            <div className='item'>
                <div className='item-id'>ID: { this.props.item_id }</div>
                <div className='item-name'>Name: { this.props.item_name }</div>
                <div className='item-type'>Type: { this.props.item_type }</div>
                <div className='item-desc'>Description: { this.props.item_desc }</div>
                <div className='item-desc'>Price: { this.props.item_price }</div>
                <div className='item-desc'>Stock: { this.props.item_stock }</div>
                {this.props.customer_id && 
                <form onSubmit={ this.addToCart }>
                    <input
                        type = "number"
                        name = "quantity"
                        value = { this.state.quantity }
                        onChange = { this.handleInputChange }
                    />
                    <input type="submit" value="Add to cart" />
                </form>}
            </div>
        );
    }
}
