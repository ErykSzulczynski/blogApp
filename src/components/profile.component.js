import React, { Component } from "react";
import AuthService from "../services/auth.service";
import PostsService from "../services/posts.service";
import Modal from 'react-bootstrap/Modal';

function MyVerticallyCenteredModal(props) {
  return (
    <Modal
      {...props}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
      className="text-white"
    >
      <Modal.Header closeButton className="bg-dark border border-secondary">
        <Modal.Title id="contained-modal-title-vcenter">
          Add Post
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className="bg-dark border border-secondary">
            <form onSubmit={() => props.handleSubmit}>
              <div className="form-group">
                <label>
                  Title<br/>
                </label>
                <input class="form-control" type="text" name="addTitleInputValue" onChange={() => props.handleChange}/>
              </div>
              <div className="form-group">
              <label>
                Content<br/>
              </label>
              <textarea class="form-control" name="addContentInputValue" onChange={() => props.handleChange}/>
              </div>
              <input class="btn btn-primary" type="submit"  value="Dodaj post"/>
            </form>
      </Modal.Body>
    </Modal>
  );
}

export default class Profile extends Component {
  constructor(props) {
    super(props);

    this.state = {
      currentUser: AuthService.getCurrentUser(),
      userPosts: "Not loaded",
      userPostsStatus: false,
      addTitleInputValue: "",
      addContentInputValue: "",
      userId: "",
      modalShow: false
    };

    this.setPostsState = this.setPostsState.bind(this)
    this.handleInputChange = this.handleInputChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
    this.setModalShow = this.setModalShow.bind(this)
  }

  setModalShow(){
    this.setState(prevstate => ({
     modalShow: !prevstate.modalShow
    }));
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
    console.log("Handlesubmit")
    PostsService.addPost(this.state.addTitleInputValue, this.state.addContentInputValue, this.state.userId)
    event.preventDefault();
  }

  setPostsState = (val, uId) => {
    this.setState({
      userPosts: val.data.Post,
      userPostsStatus: true,
      userId: uId
    })
  }

  render() {
    const { currentUser } = this.state;
    if(this.state.userPosts === "Not loaded"){
      let postsObj = PostsService.getUserPosts(currentUser.id)
      postsObj.then(result => this.setPostsState(result, currentUser.id))
    }
    return (
      <div>
         <MyVerticallyCenteredModal
        show={this.state.modalShow}
        onHide={() => this.setModalShow()}
        />
        <div className="container text-white">

        <header className="jumbotron bg-dark text-white my-4">
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
        <ul className="list-group mb-4">
          {currentUser.roles &&
            currentUser.roles.map((role, index) => <li className="list-group-item list-group-item-dark" key={index}>{role}</li>)}
        </ul>
        <div>
          <form>
              <div className="form-group">
                <label>
                  Title<br/>
                </label>
                <input className="form-control" type="text" name="addTitleInputValue" onChange={this.handleInputChange}/>
              </div>
              <div className="form-group">
              <label>
                Content<br/>
              </label>
              <textarea className="form-control" name="addContentInputValue" onChange={this.handleInputChange}/>
              </div>
              <input className="btn btn-primary" type="submit" value="Dodaj post" onClick={() => this.handleSubmit()}/>
          </form>
          <h2 className="mt-4">My posts {/*<button type="button" class="btn btn-primary" onClick={() => this.setModalShow()}>Add Post</button>*/}</h2>
          <div>
            {this.state.userPostsStatus ? this.state.userPosts.map(item => <div key={item._id}><h2>{item.title}</h2><p>{item.author + " | " + item.date}</p><p>{item.text}</p></div>) : null}
          </div>
        </div>
        </div>
      </div>
      
    );
  }
}