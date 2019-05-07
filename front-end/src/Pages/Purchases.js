import React, { Component } from 'react';

import constants from '../constants';
import './css/Purchases.css';

export default class Purchases extends Component {
    constructor(props) {
        super(props)

        this.state = {
            purchases: null,
        };

        this.retrievePurchases = this.retrievePurchases.bind(this);
    }

    componentWillMount() {
        this.retrievePurchases();
    }

    async retrievePurchases() {
        try {
            let body = {
                customer_id: this.props.customer_id,
            }
            let response = await fetch(constants.API.hostname + '/getpurchases', {
                method: 'POST',
                headers: { 'Content-Type':'application/json' },
                body: JSON.stringify(body),
            });

            const json = await response.json(); 
            console.log(json);

            this.setState({
                purchases: json.purchases,
            });
        } catch(err) {
            console.log(err);
        }
    }

    render() {
        return(
            <div className="purchases">
                <h2>{this.props.customer_name + "'s Past Purchases"}</h2>
                {this.state.purchases && this.state.purchases.length === 0 && <h3>No past purchases</h3>}
                {this.state.purchases && this.state.purchases.map(purchase => (
                    <div className="purchase-object" key={purchase.purchase_id}>
                        <p>Purchase id: {purchase.purchase_id}</p>
                        <p>Purchase date: {purchase.purchase_date}</p>
                        <p>Address: {purchase.address1 + " "} {purchase.address2 !== null && purchase.address2 + " "}</p>
                        <p>Card number: {purchase.card_number}</p>
                        <p>Seller name: {purchase.seller_name}</p>
                        <p>Item name: {purchase.item_name}</p>
                        <p>Quantity: {purchase.quantity}</p>
                        <p>Total cost: {purchase.total_cost}</p>
                    </div>
                ))}
            </div>
            
            
        );
    }
}