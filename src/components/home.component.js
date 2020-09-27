import React, { Component } from "react";
import PostsService from "../services/posts.service";
import UserService from "../services/user.service"
import Post from "../components/post.component"
import styled from 'styled-components'

export default class Home extends Component {
  constructor(props) {
    super(props);

    this.state = {
      content: "",
      specPostActive: false,
      currPostId: "",
      currPostTitle: "",
      currPostAuthor: "",
      currPostDate: "",
      currPostText: ""
    };

    this.loadIdPost = this.loadIdPost.bind(this);
    this.goBack = this.goBack.bind(this)
  }

  loadIdPost = (id) => {
    let dataResult;
    PostsService.getPost(id).then(result => {
      let currPost = result.data.Post[0]
      this.setState({
        specPostActive: true,
        currPostId: currPost._id,
        currPostTitle: currPost.title,
        currPostAuthor: currPost.author,
        currPostDate: currPost.date,
        currPostText: currPost.text
      })
    });
  }

  goBack = () => {
    this.setState({
      specPostActive: false
    })
  }

  componentDidMount() {
    PostsService.getPosts().then(
      response => {
        this.setState({
          content: response.data.Posts
        });
      },
      error => {
        this.setState({
          content:
            (error.response && error.response.data) ||
            error.message ||
            error.toString()
        });
      }
    );
  }

  render() {
    let posts = this.state.content
    const Post = styled.div`
      color: white;
    `;
    return (
      <div className="container my-4">
        <div class="jumbotron jumbotron-fluid bg-dark text-white">
          <div class="container">
            <h1 class="display-4">📋 Posts Page</h1>
            <p class="lead">Here you can see all users posts</p>
          </div>
        </div>
          {this.state.specPostActive ? 
            <Post>
                <button class="btn btn-outline-info mb-4" onClick={() => {this.goBack()}}>Go back</button>
                <h2>{this.state.currPostTitle}</h2>
                <p>{this.state.currPostAuthor} | {this.state.currPostDate}</p>
                <p>{this.state.currPostText}</p>
            </Post> : 
            posts ? posts.map(item => <div class="card bg-dark my-4"><div class="card-body"><Post><h2>{item.title}</h2><p>{item.author + " | " + item.date}</p><p>{item.text}</p><button type="button" class="btn btn-primary" onClick = {() => this.loadIdPost(item._id)}>Read More</button></Post></div></div>) : ""
          }
      </div>
    );
  }
}