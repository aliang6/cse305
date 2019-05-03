import React, { Component } from 'react';

import constants from '../constants';
import './css/Store.css';

import Items from './Items';

export default class Store extends Component {
    constructor(props){
        super(props);

        this.state = {
            item_types_arr: null,
            item_name: '',
            item_desc: '',
            item_price: '',
            item_stock: '',
            item_type: '',
            updated: true,
        }

        this.handleInputChange = this.handleInputChange.bind(this);
        this.submitItem = this.submitItem.bind(this);
    }

    componentWillMount() {
        this.retrieveItemTypes();
    }

    async retrieveItemTypes() {
        try {
            const response = await fetch(constants.API.hostname + '/itemtypes', {
                method: 'GET',
                headers: { 'Content-Type':'application/json' },
            });
            const json = await response.json(); 
            this.setState({
                item_types_arr: json.item_types
            })
        } catch(err) {
            console.log(err);
        }
    }

    handleInputChange(event) {
        const target = event.target;
        const name = target.name;
        const value = target.value;

        this.setState({
            [name]: value
        });
    }

    async submitItem(event) {
        event.preventDefault();
        try {
            let body = {
                seller_id: this.props.sellerId,
                item_name: this.state.item_name,
                item_desc: this.state.item_desc,
                item_price: parseInt(this.state.item_price).toFixed(2),
                item_stock: this.state.item_stock,
                item_type: this.state.item_type,
            }
            /* this.setState({
                updated: false,
            }); */
            const response = await fetch(constants.API.hostname + '/additem', {
                method: 'POST',
                headers: { 'Content-Type':'application/json' },
                body: JSON.stringify(body),
            });
            const json = await response.json(); 
            console.log(json);
            /*this.setState({
                updated: true,
            });*/
        } catch(err) {
            console.log(err);
            /*this.setState({
                updated: true,
            });*/
        }
    }

    render() {
        return(
            <div>
                <h2>{this.props.sellerName + " Store"}</h2>
                <div className='store'>
                    {this.state.updated && <Items className="store-items" seller_id={ this.props.sellerId }/>}
                    <div>
                        <h3>Add/Update Item</h3>
                        <form className="store-form" onSubmit={ this.submitItem }>
                            <label>
                                Name:
                                <input 
                                    type = "text"
                                    name = "item_name"
                                    value = { this.state.item_name }
                                    onChange = { this.handleInputChange }
                                />
                            </label>
                            <label>
                                Description:
                                <input 
                                    type = "text"
                                    name = "item_desc"
                                    value = { this.state.item_desc }
                                    onChange = { this.handleInputChange }
                                />
                            </label>
                            <label>
                                Price:
                                <input 
                                    type = "text"
                                    name = "item_price"
                                    value = { this.state.item_price }
                                    onChange = { this.handleInputChange }
                                />
                            </label>
                            <label>
                                Stock:
                                <input 
                                    type = "number"
                                    name = "item_stock"
                                    value = { this.state.item_stock }
                                    onChange = { this.handleInputChange }
                                />
                            </label>
                            <label>
                                Type:
                                <select name="item_type" value={this.state.item_type} onChange={this.handleInputChange}>
                                    {this.state.item_types_arr && this.state.item_types_arr.map(category => (
                                        <option value={category} key={category}>{category}</option>
                                    ))}
                                </select>
                            </label>
                            <input type="submit" value="Submit" />
                        </form>
                    </div>
                </div>
            </div>
        );
    }
}
