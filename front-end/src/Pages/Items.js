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
            customer_id: null,
            search_query: '',
        }

        this.handleInputChange = this.handleInputChange.bind(this);
        this.searchItems = this.searchItems.bind(this);
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

    handleInputChange(event) {
        const target = event.target;
        const name = target.name;
        const value = target.value;

        this.setState({
            [name]: value,
        });
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

            this.setState({
                items: json.items,
            });
        } catch(err) {
            console.log(err);
        }
    }

    async searchItems(event) {
        event.preventDefault();
        try {
            let body = {
                q: this.state.search_query,
            };
            let response = await fetch(constants.API.hostname + '/search', {
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

    render() {
        return(
            <div className="items">
                {!this.state.seller_id && <h2>All Items</h2>}
                {this.state.seller_id && <h2>Seller's Items</h2>}
                {!this.props.seller_id &&
                    <form className="search" onSubmit={this.searchItems}>
                        <input 
                            type = "text"
                            name = "search_query" 
                            value = { this.state.search_query }
                            onChange = { this.handleInputChange }
                        />
                        <input type="submit" value="Search" />
                    </form>
                }
                <div className="item-list">
                    {this.state.items && this.state.items.length === 0 && <h3>No items</h3>}
                    {this.state.items && this.state.items.map(item => (
                        <Item
                            item_id = { item.id }
                            item_name = { item.item_name }
                            item_type = { item.category }
                            item_desc = { item.item_description }
                            item_price = { item.price }
                            item_stock = { item.stock }
                            customer_id = { this.props.customer_id }
                            seller_id = { this.props.seller_id }
                            addToCartHandler = { this.addToCart }
                            key = { item.id }
                        />
                    ))}
                </div>
            </div>
        );
    }
}