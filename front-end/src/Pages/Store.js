import React, { Component } from 'react';

import constants from '../constants';
import './css/Store.css';

import Items from './Items';

export default class Store extends Component {
    constructor(props){
        super(props);

        this.state = {
            item_types_arr: null,
            add_item_name: '',
            add_item_desc: '',
            add_item_price: '',
            add_item_stock: '',
            add_item_type: '',
            update_item_id: '',
            update_item_name: '',
            update_item_desc: '',
            update_item_price: '',
            update_item_stock: '',
            update_item_type: '',
            remove_item_id: '',
            updated: true,
        };

        this.handleInputChange = this.handleInputChange.bind(this);
        this.addItem = this.addItem.bind(this);
        this.updateItem = this.updateItem.bind(this);
        this.removeItem = this.removeItem.bind(this);
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
                item_types_arr: json.item_types,
                add_item_type: json.item_types[0],
                update_item_type: json.item_types[0],
            });
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

    async addItem(event) {
        event.preventDefault();
        try {
            let body = {
                seller_id: this.props.sellerId,
                item_name: this.state.add_item_name,
                item_desc: this.state.add_item_desc,
                item_price: parseInt(this.state.add_item_price).toFixed(2),
                item_stock: this.state.add_item_stock,
                item_type: this.state.add_item_type,
            };
            this.setState({
                updated: false,
            });
            const response = await fetch(constants.API.hostname + '/addlisting', {
                method: 'POST',
                headers: { 'Content-Type':'application/json' },
                body: JSON.stringify(body),
            });
            const json = await response.json(); 
            console.log(json);
            this.setState({
                updated: true,
            });
        } catch(err) {
            console.log(err);
            this.setState({
                updated: true,
            });
        }
    }

    async updateItem(event) {
        event.preventDefault();
        try {
            let body = {
                seller_id: this.props.sellerId,
                item_id: this.state.update_item_id,
                item_name: this.state.update_item_name,
                item_desc: this.state.update_item_desc,
                item_price: parseInt(this.state.update_item_price).toFixed(2),
                item_stock: this.state.update_item_stock,
                item_type: this.state.update_item_type,
            }
            this.setState({
                updated: false,
            });
            const response = await fetch(constants.API.hostname + '/updatelisting', {
                method: 'POST',
                headers: { 'Content-Type':'application/json' },
                body: JSON.stringify(body),
            });
            const json = await response.json(); 
            console.log(json);
            this.setState({
                updated: true,
            });
        } catch(err) {
            console.log(err);
            this.setState({
                updated: true,
            });
        }
    }

    async removeItem(event) {
        event.preventDefault();
        try {
            let body = {
                seller_id: this.props.sellerId,
                item_id: this.state.remove_item_id,
            }
            this.setState({
                updated: false,
            });
            const response = await fetch(constants.API.hostname + '/removelisting', {
                method: 'POST',
                headers: { 'Content-Type':'application/json' },
                body: JSON.stringify(body),
            });
            const json = await response.json(); 
            console.log(json);
            this.setState({
                updated: true,
            });
        } catch(err) {
            console.log(err);
            this.setState({
                updated: true,
            });
        }
    }

    render() {
        return(
            <div>
                <h2>{this.props.sellerName + " Store"}</h2>
                <div className='store'>
                    {this.state.updated && <Items className="store-items" seller_id={ this.props.sellerId }/>}
                    <div>
                        <h3>Add Item</h3>
                        <form className="store-form" onSubmit={ this.addItem }>
                            <label>
                                Name:
                                <input 
                                    type = "text"
                                    name = "add_item_name"
                                    value = { this.state.add_item_name }
                                    onChange = { this.handleInputChange }
                                />
                            </label>
                            <label>
                                Description:
                                <input 
                                    type = "text"
                                    name = "add_item_desc"
                                    value = { this.state.add_item_desc }
                                    onChange = { this.handleInputChange }
                                />
                            </label>
                            <label>
                                Price:
                                <input 
                                    type = "number"
                                    name = "add_item_price"
                                    value = { this.state.add_item_price }
                                    onChange = { this.handleInputChange }
                                />
                            </label>
                            <label>
                                Stock:
                                <input 
                                    type = "number"
                                    name = "add_item_stock"
                                    value = { this.state.add_item_stock }
                                    onChange = { this.handleInputChange }
                                />
                            </label>
                            <label>
                                Type:
                                <select name="add_item_type" value={this.state.add_item_type} onChange={this.handleInputChange}>
                                    {this.state.item_types_arr && this.state.item_types_arr.map(category => (
                                        <option value={category} key={category}>{category}</option>
                                    ))}
                                </select>
                            </label>
                            <input type="submit" value="Submit" />
                        </form>
                        <h3>Update Item</h3>
                        <form className="store-form" onSubmit={ this.updateItem }>
                            <label>
                                ID:
                                <input 
                                    type = "number"
                                    name = "update_item_id"
                                    value = { this.state.update_item_id }
                                    onChange = { this.handleInputChange }
                                />
                            </label>
                            <label>
                                Name:
                                <input 
                                    type = "text"
                                    name = "update_item_name"
                                    value = { this.state.update_item_name }
                                    onChange = { this.handleInputChange }
                                />
                            </label>
                            <label>
                                Description:
                                <input 
                                    type = "text"
                                    name = "update_item_desc"
                                    value = { this.state.update_item_desc }
                                    onChange = { this.handleInputChange }
                                />
                            </label>
                            <label>
                                Price:
                                <input 
                                    type = "number"
                                    name = "update_item_price"
                                    value = { this.state.update_item_price }
                                    onChange = { this.handleInputChange }
                                />
                            </label>
                            <label>
                                Stock:
                                <input 
                                    type = "number"
                                    name = "update_item_stock"
                                    value = { this.state.update_item_stock }
                                    onChange = { this.handleInputChange }
                                />
                            </label>
                            <label>
                                Type:
                                <select name="update_item_type" value={this.state.update_item_type} onChange={this.handleInputChange}>
                                    {this.state.item_types_arr && this.state.item_types_arr.map(category => (
                                        <option value={category} key={category}>{category}</option>
                                    ))}
                                </select>
                            </label>
                            <input type="submit" value="Submit" />
                        </form>
                        <h3>Remove Item</h3>
                        <form className="store-form" onSubmit={ this.removeItem }>
                            <label>
                                ID:
                                <input 
                                    type = "number"
                                    name = "remove_item_id"
                                    value = { this.state.remove_item_id }
                                    onChange = { this.handleInputChange }
                                />
                                <input type="submit" value="Submit" />
                            </label>
                        </form>
                    </div>
                </div>
            </div>
        );
    }
}
