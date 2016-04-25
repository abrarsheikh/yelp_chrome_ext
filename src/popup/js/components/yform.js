import React from "react";

export default class YForm extends React.Component {
    constructor() {
        super();
        this.state = {y_find: '', y_location: ''};
    }

    handleYFindChange(e) {
        this.setState({y_find: e.target.value});
    }

    handleLocationChange(e) {
        this.setState({y_location: e.target.value});
    }

    handleSubmit(e) {
        e.preventDefault();
        var y_find = this.state.y_find.trim();
        var y_location = this.state.y_location.trim();
        chrome.runtime.sendMessage(
            {
                source: 'popup',
                y_find: y_find,
                y_location: y_location
            },
            function (response) {
                console.log(response);
            });
        this.setState({y_find: '', y_location: ''});
    }

    render() {
        return (
            <div class="row">
                <form class="form-horizontal" onSubmit={this.handleSubmit.bind(this)}>
                    <div class="form-group">
                        <label for="y_find" class="col-xs-2 control-label">Find</label>
                        <div class="col-xs-10">
                            <input
                                type="text"
                                class="form-control"
                                id="y_find"
                                placeholder="pizza, wine, vintage clothing"
                                value={this.state.y_find}
                                onChange={this.handleYFindChange.bind(this)}
                            />
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="y_location" class="col-xs-2 control-label">Location</label>
                        <div class="col-xs-10">
                            <input
                                type="text"
                                class="form-control"
                                id="y_location"
                                placeholder="San Francisco"
                                value={this.state.y_location}
                                onChange={this.handleLocationChange.bind(this)}
                            />
                        </div>
                    </div>
                    <div class="form-group">
                        <div class="col-xs-offset-2 col-xs-10">
                            <button type="submit" class="btn btn-default">Find on Yelp</button>
                        </div>
                    </div>
                </form>
            </div>
        );
    }
}
