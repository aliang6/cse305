import React, { Component } from 'react';

import constants from '../constants';
import './css/Purchases.css';

export default class Shipments extends Component {
    constructor(props) {
        super(props)

        this.state = {
            shipments: null,
        };

        this.retrieveShipments = this.retrieveShipments.bind(this);
    }

    componentWillMount() {
        this.retrieveShipments();
    }

    async retrieveShipments() {
        try {
            let body = {
                customer_id: this.props.customer_id,
            }
            let response = await fetch(constants.API.hostname + '/getshipments', {
                method: 'POST',
                headers: { 'Content-Type':'application/json' },
                body: JSON.stringify(body),
            });

            const json = await response.json(); 
            console.log(json);

            this.setState({
                shipments: json.shipments,
            });
        } catch(err) {
            console.log(err);
        }
    }

    render() {
        return(
            <div className="purchases">
                <h2>{this.props.customer_name + "'s Shipments"}</h2>
                {this.state.shipments && this.state.shipments.length === 0 && <h3>No shipments</h3>}
                {this.state.shipments && this.state.shipments.map(shipment => (
                    <div className="purchase-object" key={shipment.purchase_id}>
                        <p>Shipment id: {shipment.shipment_id}</p>
                        <p>Item: {shipment.item_name}</p>
                        <p>Address: {shipment.address1 + " "} {shipment.address2 !== null && shipment.address2 + " "}</p>
                        <p>Tracking number: {shipment.tracking_number}</p>
                        <p>Process date: {shipment.process_date}</p>
                        <p>Arrival date: {shipment.arrival_date}</p>
                        <p>Shipping fee: {shipment.shipping_fee}</p>
                    </div>
                ))}
            </div>
            
            
        );
    }
}