import React, { Component } from 'react';
import styles from './styles.css';
import axios from 'axios';
import _ from 'lodash';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      users: []
    }
  }

  handleChange(e) {
    let inputId = e.target.id;
    this.setState({ [inputId]: e.target.value });
  }

  requestUsers(){
    let firstName = this.state.firstName;
    let lastName = this.state.lastName;

    axios.get('http://localhost:5000/getUsers', {
      params: {
        firstName,
        lastName
      }
    })
      .then((response) => {
        this.setState({users: response.data});
      })
      .catch(err=>{
        console.log(err)
      })
  }

  renderUserList() {
    let users = this.state.users;
    if (!_.size(users)) return [<p>Users not found</p>];

    let tds = [];
    for (let user of users){
      let {id, email, first_name, last_name, avatar} = user;
      let img = <img src={avatar}/>;
      tds.push(
        <tr>
          <td>{id}</td>
          <td>{email}</td>
          <td>{first_name}</td>
          <td>{last_name}</td>
          <td>{img}</td>
        </tr>
      )
    }

    let table = [
      <table className="usersTable">
        <tr>
          <th>Id</th>
          <th>Email</th>
          <th>First name</th>
          <th>Last name</th>
          <th>Avatar</th>
        </tr>
        {tds}
      </table>
    ];


    return table
  }

  render()  {
    return (
      <div className="App">
        <div className="labels">
          <input placeholder="First name" id="firstName" onChange={ this.handleChange.bind(this) }/>
          <input placeholder="Last name" id="lastName" onChange={ this.handleChange.bind(this) }/>
        </div>

        <button className="searchButton" onClick={this.requestUsers.bind(this)}>Search</button>

        {this.renderUserList()}
      </div>
    );
  }
}

export default App;
