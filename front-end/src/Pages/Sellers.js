import React, { Component } from 'react';
import { Route, Link, BrowserRouter as Router } from 'react-router-dom'

import './Sellers.css';
import constants from '../constants';

import Items from './Items';
import Seller from './Seller/Seller';

export default class Sellers extends Component {
    constructor(props) {
        super(props)

        this.state = {
            sellers: null,
            selectedSeller: null,
            refreshItems: false,
        }

        this.sellerClicked = this.sellerClicked.bind(this);
    }

    componentWillMount() {
        this.retrieveSellers();
    }

    componentDidUpdate() {
        console.log("after update: " + this.state.selectedSeller);
    }

    refreshItems() {
        this.setState({ refreshItems: !this.state.refreshItems });
    } 

    async retrieveSellers() {
        try {
            const response = await fetch(constants.API.hostname + '/sellers', {
                method: 'GET',
                headers: { 'Content-Type':'application/json' },
            });
            const json = await response.json(); 
            console.log(json);
            this.setState({
                sellers: json.sellers,
            });
        } catch(err) {
            console.log(err);
        }
    }

    sellerClicked(id) {
        this.setState({
            selectedSeller: id,
        });
        this.refreshItems();
    }

    render() {
        return(
            <div>
                <div className="sellers">
                    {this.state.selectedSeller && <Items seller_id={ this.state.selectedSeller }/>}
                    <h1>Sellers Page</h1>
                    <div className="seller-list">
                        {this.state.sellers && this.state.sellers.map(seller => (
                            <Seller
                                seller_id = { seller.id }
                                seller_name = { seller.seller_name }
                                seller_desc = { seller.seller_description }
                                key = { seller.id }
                                sellerClicked = {this.sellerClicked}
                            />
                        ))}
                    </div>
                </div> 
                
            </div> 
        );
    }
}