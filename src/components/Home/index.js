import {withRouter, Link} from 'react-router-dom'
import Header from '../Header'
import './index.css'

const Home = props => {
  const onClickingFindJObs = () => {
    const {history} = props
    history.replace('/jobs')
  }
  return (
    <>
      <Header />
      <div className="home-container">
        <div className="content-container">
          <h1 className="home-title">Find the Job That Fits Your Life</h1>
          <p className="home-description">
            Millions of people are searching for jobs, salary information,
            comapny reviews. Find the job that fits your abilities and
            potential.
          </p>
          <Link to="/jobs" className="link-item">
            <button type="button" className="find-jobs-button">
              Find Jobs
            </button>
          </Link>
        </div>
      </div>
    </>
  )
}

export default withRouter(Home)
