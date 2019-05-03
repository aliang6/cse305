import React, { Component } from 'react';
import { Route, Link, BrowserRouter as Router } from 'react-router-dom'

import './Header.css';
import Items from '../Pages/Items';
import Sellers from '../Pages/Sellers';
import Cart from '../Pages/Cart';
import Login from '../Pages/Login';

export default class Header extends Component {

    constructor(props) {
        super(props);

        this.state = {
            customerId: null,
            customerName: null,
            sellerId: null,
            sellerName: null,
        }

        this.updateCustomerId = this.updateCustomerId.bind(this);
        this.updateSellerId = this.updateSellerId.bind(this);
    }

    updateCustomerId(json) {
        let customerId = json.id;
        if(customerId > 0) {
            let customerName = json.first_name + " " + json.last_name;
            this.setState({
                customerId: customerId,
                customerName: customerName,
                sellerId: null,
                sellerName: null,
            });
            alert("Logged in as customer (" + customerId + ") " + customerName);
        } else {
            alert("Invalid login credentials");
        }
    }

    updateSellerId(json) {
        let sellerId = json.id;
        if(sellerId > 0) {
            let sellerName = json.seller_name;
            this.setState({
                customerId: null,
                customerName: null,
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
                            <Link className="header-btn" to="/login">Login</Link>
                            {this.state.customerId && 
                            <div className="customer-links">
                                <Link className="header-btn" to="/cart">Cart</Link>
                                <Link className="header-btn" to="/profile">Profile</Link>
                                <p>Customer #{this.state.customerId + " " + this.state.customerName}</p>
                            </div>}
                            {this.state.sellerId && 
                            <div className="seller-links">
                                <Link className="header-btn" to="/listitem">List Item</Link>
                                <p>Seller #{this.state.sellerId + " " + this.state.sellerName}</p>
                            </div>
                            }
                        </div>
                    </ul>
                </div>
                
                <Route exact path="/" component={Items} />
                <Route path="/items" component={Items} />
                <Route path="/sellers" component={Sellers} />
                <Route path="/cart" component={Cart} />
                <Route path="/profile" component={Cart} />
                <Route path="/login" 
                    render={ (props) => 
                    <Login {...props} updateCustomerId={ this.updateCustomerId } updateSellerId={ this.updateSellerId } /> }
                />
            </Router>
            
        );
    }
}

