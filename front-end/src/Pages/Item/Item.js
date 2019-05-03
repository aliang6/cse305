import React, { Component } from 'react';
import './Item.css';

export default class Item extends Component {
    constructor(props){
        super(props);
    }

    render() {
        return(
            <div className='item'>
                <div className='item-name'>Name: { this.props.item_name }</div>
                <div className='item-type'>Type: { this.props.item_type }</div>
                <div className='item-desc'>Description: { this.props.item_desc }</div>
                <div className='item-desc'>Price: { this.props.item_price }</div>
                <div className='item-desc'>Stock: { this.props.item_stock }</div>
            </div>
        );
    }
}
