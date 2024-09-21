import {Link, withRouter} from 'react-router-dom'
import Cookies from 'js-cookie'
import './index.css'

const Header = props => {
  const onClickingLogout = () => {
    const {history} = props
    Cookies.remove('jwt_token')
    history.replace('/login')
  }
  return (
    <div className="header-container">
      <Link to="/" className="logo-image">
        <img
          src="https://assets.ccbp.in/frontend/react-js/logo-img.png"
          alt="website logo"
        />
      </Link>
      <ul className="home-jobs">
        <li>
          <Link to="/" className="link-item">
            Home
          </Link>
        </li>
        <li>
          <Link to="/jobs" className="link-item">
            Jobs
          </Link>
        </li>
        <li>
          <button
            type="button"
            className="logout-button"
            onClick={onClickingLogout}
          >
            Logout
          </button>
        </li>
      </ul>
    </div>
  )
}

export default withRouter(Header)
