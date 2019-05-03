import React, { Component } from 'react';

/* components */
import Header from './Header';

export default class Home extends Component {
    constructor(props) {
        super(props);

        this.state = {
        };
    }

    render() {
        return (
            <Header />
        )
    }

};