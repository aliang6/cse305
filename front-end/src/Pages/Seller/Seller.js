import React, { Component } from 'react';


import './Seller.css';

export default class Seller extends Component {
    constructor(props){
        super(props);

        this.seeSellerItems = this.seeSellerItems.bind(this);
    }

    seeSellerItems(){
        this.props.sellerClicked(this.props.seller_id);
    }

    render() {
        return(
            <div className='seller'>
                <div className='seller-name'>Name: { this.props.seller_name }</div>
                <div className='seller-desc'>Description: { this.props.seller_desc }</div>
                <button className='seller-items-btn' onClick={ this.seeSellerItems }>See seller's items</button>
            </div>
        );
    }
}
