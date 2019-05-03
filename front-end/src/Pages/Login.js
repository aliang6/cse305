import React, { Component } from 'react';

import './Login.css'

import constants from '../constants';


export default class Home extends Component {
    constructor(props) {
        super(props);

        this.state = {
            login_email: '',
            login_seller_name: '',
            signup_first_name: '',
            signup_last_name: '',
            signup_email: '',
            signup_phone: '',
            signup_seller_name: '',
            signup_seller_desc: '',
        };
        
        this.handleInputChange = this.handleInputChange.bind(this);
        this.customerLogin = this.customerLogin.bind(this);
        this.sellerLogin = this.sellerLogin.bind(this);
        this.customerSignup = this.customerSignup.bind(this);
        this.sellerSignup = this.sellerSignup.bind(this);
    }

    handleInputChange(event) {
        const target = event.target;
        const name = target.name;
        const value = target.value;

        this.setState({
            [name]: value
        });
    }

    // Login
    async customerLogin(event) {
        event.preventDefault();
        let body = {
            email: this.state.login_email,
        }
        const response = await fetch(constants.API.hostname + '/customerlogin', {
            method: 'POST',
            headers: { 'Content-Type':'application/json' },
            body: JSON.stringify(body),
        });
        const json = await response.json(); 
        this.props.updateCustomerId(json);
    }

    async sellerLogin(event) {
        event.preventDefault();
        let body = {
            seller_name: this.state.login_seller_name
        }
        const response = await fetch(constants.API.hostname + '/sellerlogin', {
            method: 'POST',
            headers: { 'Content-Type':'application/json' },
            body: JSON.stringify(body),
        });
        const json = await response.json(); 
        this.props.updateSellerId(json);
    }

    // Signup
    async customerSignup(event) {
        event.preventDefault();
        let body = {
            first_name: this.state.signup_first_name,
            last_name: this.state.signup_last_name,
            email: this.state.signup_email,
            phone: this.state.signup_phone
        }
        const response = await fetch(constants.API.hostname + '/customersignup', {
            method: 'POST',
            headers: { 'Content-Type':'application/json' },
            body: JSON.stringify(body),
        });
        const json = await response.json();
        this.props.updateCustomerId(json);
    }

    async sellerSignup(event) {
        event.preventDefault();
        let body = {
            name: this.state.signup_seller_name,
            desc: this.state.signup_seller_desc,
        }
        const response = await fetch(constants.API.hostname + '/sellersignup', {
            method: 'POST',
            headers: { 'Content-Type':'application/json' },
            body: JSON.stringify(body),
        });
        const json = await response.json();
        this.props.updateSellerId(json);
    }

    render() {
        return (
            <div className="login-page">
                <div className="login-form">
                    <form onSubmit={ this.customerLogin }>
                        <h2>Customer Login</h2>
                        <label>
                            Email: 
                            <input 
                                type="text" 
                                name="login_email" 
                                value={ this.state.login_email } 
                                onChange={ this.handleInputChange }
                            />
                        </label>
                        <input type="submit" value="Submit" />
                    </form>

                    <form onSubmit={ this.sellerLogin }>
                        <h2>Seller Login</h2>
                        <label>
                            Seller Name:
                            <input 
                                type="text" 
                                name="login_seller_name" 
                                value={ this.state.login_seller_name } 
                                onChange={ this.handleInputChange }
                            />
                        </label>
                        <input type="submit" value="Submit" />
                    </form>
                </div>

                <div className="login-form">
                    <form onSubmit={this.customerSignup}>
                        <h2>Customer Signup</h2>
                        <label>
                            First Name: 
                            <input 
                                type="text" 
                                name="signup_first_name" 
                                value={ this.state.signup_first_name } 
                                onChange={ this.handleInputChange }
                            />
                        </label>
                        <label>
                            Last Name: 
                            <input 
                                type="text" 
                                name="signup_last_name" 
                                value={ this.state.signup_last_name } 
                                onChange={ this.handleInputChange }
                            />
                        </label>
                        <label>
                            Email: 
                            <input 
                                type="text" 
                                name="signup_email" 
                                value={ this.state.signup_email } 
                                onChange={ this.handleInputChange }
                            />
                        </label>
                        <label>
                            Phone Number: 
                            <input 
                                type="text" 
                                name="signup_phone" 
                                value={ this.state.signup_phone } 
                                onChange={ this.handleInputChange }
                            />
                        </label>
                        <input type="submit" value="Submit" />
                    </form>

                    <form onSubmit={ this.sellerSignup }>
                        <h2>Seller Signup</h2>
                        <label>
                            Name:
                            <input 
                                type="text" 
                                name="signup_seller_name"
                                value={ this.state.signup_seller_name }
                                onChange={ this.handleInputChange }
                            />
                        </label>
                        <label>
                            Description:
                            <input 
                                type="text"
                                name="signup_seller_desc" 
                                value={ this.state.signup_seller_desc }
                                onChange={ this.handleInputChange }
                            />
                        </label>
                        <input type="submit" value="Submit" />
                    </form>
                </div>
            </div>
        );
    }

};