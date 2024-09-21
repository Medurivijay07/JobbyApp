import Cookies from 'js-cookie'
import {Component} from 'react'
import {Redirect} from 'react-router-dom'

import './index.css'

class Login extends Component {
  state = {username: '', password: '', showErrorMsg: false, errMsg: ''}

  onChangeUsername = event => {
    this.setState({username: event.target.value})
  }

  onChangePassword = event => {
    this.setState({password: event.target.value})
  }

  onSubmitSuccess = jwtToken => {
    const {history} = this.props
    Cookies.set('jwt_token', jwtToken, {expires: 30})
    history.replace('/')
  }

  onSubmitFailure = errMsg => {
    this.setState({showErrorMsg: true, errMsg})
  }

  onSubmitForm = async event => {
    event.preventDefault()
    const {username, password} = this.state
    const userDetails = {username, password}
    const apiUrl = 'https://apis.ccbp.in/login'
    const options = {
      method: 'POST',
      body: JSON.stringify(userDetails),
    }
    const response = await fetch(apiUrl, options)
    const data = await response.json()
    if (response.ok === true) {
      this.onSubmitSuccess(data.jwt_token)
    } else {
      this.onSubmitFailure(data.error_msg)
    }
  }

  renderUsername = () => {
    const {username} = this.state
    return (
      <div className="user-container">
        <label htmlFor="username" className="username-label">
          USERNAME
        </label>
        <input
          className="username-input"
          id="username"
          type="text"
          placeholder="Username"
          onChange={this.onChangeUsername}
          value={username}
        />
      </div>
    )
  }

  renderPassword = () => {
    const {password} = this.state
    return (
      <div className="user-container">
        <label htmlFor="password" className="username-label">
          PASSWORD
        </label>
        <input
          className="username-input"
          id="password"
          type="password"
          placeholder="Password"
          onChange={this.onChangePassword}
          value={password}
        />
      </div>
    )
  }

  render() {
    const {showErrorMsg, errMsg} = this.state

    const jwtToken = Cookies.get('jwt_token')
    if (jwtToken !== undefined) {
      return <Redirect to="/" />
    }

    return (
      <div className="loginapp-container">
        <div className="login-box">
          <img
            src="https://assets.ccbp.in/frontend/react-js/logo-img.png"
            alt="website logo"
          />

          <form className="form-container" onSubmit={this.onSubmitForm}>
            {this.renderUsername()}
            {this.renderPassword()}
            <button type="submit" className="login-button">
              Login
            </button>
            {showErrorMsg ? <p className="error-msg">*{errMsg}</p> : ''}
          </form>
        </div>
      </div>
    )
  }
}

export default Login
