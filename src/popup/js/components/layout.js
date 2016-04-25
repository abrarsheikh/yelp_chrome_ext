import React from "react";
import YForm from './YForm';

import yelp_logo from '../../images/yelp_logo.png';

export default class Layout extends React.Component {
    constructor() {
        super();
    }

    render() {
        const containerStyle = {
            width: '500px',
            height: '400px'
        }
        return (
            <div class="container" style={containerStyle}>
                <div class="page-header">
                    <img class="img-responsive center-block" src={yelp_logo}/>
                </div>
                <YForm/>
            </div>
        );
    }
}
