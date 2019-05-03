import React, { Component } from 'react';

import './css/Items.css';
import constants from '../constants';

import Item from './Item/Item';

export default class Items extends Component {
    constructor(props) {
        super(props)
        
        this.state = {
            items: null,
            seller_id: null,
        }
    }

    componentWillMount() {
        let seller_id = this.props.seller_id;
        this.setState({
            seller_id: seller_id,
        })
        this.retrieveItems(seller_id);
    }

    componentWillReceiveProps(props) {
        let seller_id = props.seller_id;
        this.setState({
            seller_id: seller_id,
        })
        this.retrieveItems(seller_id);
    }

    async retrieveItems(seller_id) {
        try {
            let response;
            if(seller_id) {
                response = await fetch(constants.API.hostname + '/seller/' + seller_id, {
                    method: 'GET',
                    headers: { 'Content-Type':'application/json' },
                });
            } else {
                response = await fetch(constants.API.hostname + '/items', {
                    method: 'GET',
                    headers: { 'Content-Type':'application/json' },
                });
            }

            const json = await response.json(); 
            console.log(json);
            console.log(json.items.length);

            this.setState({
                items: json.items,
            });
        } catch(err) {
            console.log(err);
        }
    }

    render() {
        return(
            <div className="items">
                {!this.state.seller_id && <h2>All Items</h2>}
                {this.state.seller_id && <h2>Seller's Items</h2>}
                <div className="item-list">
                    {this.state.items && this.state.items.length === 0 && <h3>No items</h3>}
                    {this.state.items && this.state.items.map(item => (
                        <Item
                            item_name = { item.item_name }
                            item_type = { item.category }
                            item_desc = { item.item_description }
                            item_price = { item.price }
                            item_stock = { item.stock }
                            key = { item.id }
                        />
                    ))}
                </div>
            </div>
        );
    }
}