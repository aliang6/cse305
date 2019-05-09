import React, { Component } from 'react';
import { Route, Link, BrowserRouter as Router } from 'react-router-dom'

import './Header.css';
import Items from '../Pages/Items';
import Sellers from '../Pages/Sellers';
import Cart from '../Pages/Cart';
import Purchases from '../Pages/Purchases';
import Shipments from '../Pages/Shipments';
import Login from '../Pages/Login';
import Store from '../Pages/Store';

export default class Header extends Component {

    constructor(props) {
        super(props);

        this.state = {
            customer_id: null,
            customer_name: null,
            sellerId: null,
            sellerName: null,
        }

        this.updateCustomerId = this.updateCustomerId.bind(this);
        this.updateSellerId = this.updateSellerId.bind(this);
    }

    updateCustomerId(json) {
        let customer_id = json.id;
        if(customer_id > 0) {
            let customer_name = json.first_name + " " + json.last_name;
            this.setState({
                customer_id: customer_id,
                customer_name: customer_name,
                sellerId: null,
                sellerName: null,
            });
            alert("Logged in as customer (" + customer_id + ") " + customer_name);
        } else {
            alert("Invalid login credentials");
        }
    }

    updateSellerId(json) {
        let sellerId = json.id;
        if(sellerId > 0) {
            let sellerName = json.seller_name;
            this.setState({
                customer_id: null,
                customer_name: null,
                sellerId: sellerId,
                sellerName: sellerName,
            });
            alert("Logged in as seller (" + sellerId + ") " + sellerName);
        } else {
            alert("Invalid login credentials");
        }
    }

    render() {
        return (
            <Router>
                <div id="header">
                    <ul id="header-list">
                        <div id='header-logo'>
                            <h1>Amazon</h1>
                        </div>
                        <div id='header-links'>
                            {/*<button onClick={this.props.itemClick}>Items</button>
                            <button onClick={this.props.sellerClick}>Sellers</button>*/}
                            <Link className="header-btn" to="/items">Items</Link>
                            <Link className="header-btn" to="/sellers">Sellers</Link>
                            {this.state.customer_id && 
                            <div className="customer-links">
                                <Link className="header-btn" to="/cart">Cart</Link>
                                {/* <Link className="header-btn" to="/profile">Profile</Link> */}
                                <Link className="header-btn" to="/purchases">Purchases</Link>
                                <Link className="header-btn" to="/shipments">Shipments</Link>
                                <p>Customer #{this.state.customer_id + " " + this.state.customer_name}</p>
                            </div>}
                            {this.state.sellerId && 
                            <div className="seller-links">
                                <Link className="header-btn" to="/store">Store</Link>
                                <p>Seller #{this.state.sellerId + " " + this.state.sellerName}</p>
                            </div>}
                            <Link className="header-btn" to="/login">Login</Link>
                        </div>
                    </ul>
                </div>
                
                <Route exact path="/" 
                    render={ (props) => 
                    <Items { ...props } 
                        customer_id = { this.state.customer_id } 
                    /> }
                 />
                <Route path="/items" 
                    render={ (props) => 
                    <Items { ...props } 
                        customer_id = { this.state.customer_id } 
                    /> }
                />
                <Route path="/sellers" 
                    render={ (props) => 
                    <Sellers { ...props } 
                        customer_id = { this.state.customer_id } 
                    /> }
                />
                <Route path="/cart"  
                    render={ (props) => 
                    <Cart { ...props } 
                        customer_id = { this.state.customer_id }
                        customer_name = { this.state.customer_name }
                    /> }
                />
                <Route path="/purchases"  
                    render={ (props) => 
                    <Purchases { ...props } 
                        customer_id = { this.state.customer_id }
                        customer_name = { this.state.customer_name }
                    /> }
                />
                <Route path="/shipments"  
                    render={ (props) => 
                    <Shipments { ...props } 
                        customer_id = { this.state.customer_id }
                        customer_name = { this.state.customer_name }
                    /> }
                />
                <Route path="/profile" component={ Cart } />
                <Route path="/store" 
                    render={ (props) => 
                    <Store { ...props } 
                        sellerId = { this.state.sellerId } 
                        sellerName = { this.state.sellerName } 
                    /> }
                />
                <Route path="/login" 
                    render={ (props) => 
                    <Login { ...props } 
                        updateCustomerId={ this.updateCustomerId } 
                        updateSellerId={ this.updateSellerId } 
                    /> }
                />
            </Router>
            
        );
    }
}

