import axios from 'axios';
import authHeader from './auth-header';

const API_URL = 'http://localhost:8080/api/test/';

class PostsService {
  getPosts() {
    return axios.get(API_URL + 'posts');
  }

  getPost(id) {
    return axios.get(API_URL + 'post' + '/' + id);
  }

  getUserPosts(uId){
    return axios.get(API_URL + 'user' + '/' + uId + '/posts')
  }

  addPost(title, text, uId){
    axios({
      method: 'post',
      url: API_URL + 'post',
      data: {
        title: title,
        author: uId,
        text: text
      }
    });
  }
}

export default new PostsService();