import React, { Component } from "react";
import AuthService from "../services/auth.service";
import PostsService from "../services/posts.service"

export default class Profile extends Component {
  constructor(props) {
    super(props);

    this.state = {
      currentUser: AuthService.getCurrentUser(),
      userPosts: "Not loaded",
      userPostsStatus: false,
      addTitleInputValue: "",
      addContentInputValue: "",
      userId: ""
    };

    this.setPostsState = this.setPostsState.bind(this)
    this.handleInputChange = this.handleInputChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
  }

  handleInputChange(event) {
    const target = event.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;

    this.setState({
      [name]: value
    });
  }

  handleSubmit(event) {
    PostsService.addPost(this.state.addTitleInputValue, this.state.addContentInputValue, this.state.userId)
    event.preventDefault();
  }

  setPostsState = (val, uId) => {
    this.setState({
      userPosts: val.data,
      userPostsStatus: true,
      userId: uId
    })
  }

  render() {
    const { currentUser } = this.state;
    {
      if(this.state.userPosts == "Not loaded"){
        let postsObj = PostsService.getUserPosts(currentUser.id)
        let postObjResult;
        postsObj.then(result => this.setPostsState(result, currentUser.id))
      }
    }
    return (
      <div className="container">
        <header className="jumbotron">
          <h3>
            <strong>{currentUser.username}</strong> Profile
          </h3>
        </header>
        <p>
          <strong>Token:</strong>{" "}
          {currentUser.accessToken.substring(0, 20)} ...{" "}
          {currentUser.accessToken.substr(currentUser.accessToken.length - 20)}
        </p>
        <p>
          <strong>Id:</strong>{" "}
          {currentUser.id}
        </p>
        <p>
          <strong>Email:</strong>{" "}
          {currentUser.email}
        </p>
        <strong>Authorities:</strong>
        <ul>
          {currentUser.roles &&
            currentUser.roles.map((role, index) => <li key={index}>{role}</li>)}
        </ul>
        <div>
          <h2>My posts</h2>
          <div>
            <form onSubmit={this.handleSubmit}>
              <label>
                Tytuł post'a<br/>
                <input type="text" name="addTitleInputValue" onChange={this.handleInputChange}/>
              </label>
              <label>
                Content post'a:<br/>
                <input type="text" name="addContentInputValue" onChange={this.handleInputChange}/>
              </label>
              <input type="submit" value="Dodaj post"/>
            </form>
            {this.state.userPostsStatus ? this.state.userPosts.map(item => <div><h2>{item.title}</h2><p>{item.author + " | " + item.date}</p><p>{item.text}</p></div>) : null}
          </div>
        </div>
      </div>
    );
  }
}