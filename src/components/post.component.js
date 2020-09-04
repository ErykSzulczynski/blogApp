import React, { Component } from 'react'

export default class Post extends Component {
    render() {
        return (
            <div>
                <h2>{this.props.title}</h2>
                <p>{this.props.author} | {this.props.date}</p>
                <p>{this.props.text}</p>
            </div>
        )
    }
}
