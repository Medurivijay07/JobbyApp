import {IoIosStar} from 'react-icons/io'
import {IoLocationSharp, IoBagSharp} from 'react-icons/io5'
import Loader from 'react-loader-spinner'

import {Component} from 'react'
import Cookies from 'js-cookie'
import Header from '../Header'
import SimilarJobItem from '../SimilarJobItem'

import './index.css'

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  inprogress: 'INPROGRESS',
  failure: 'FAILURE',
}

class JobItemDetails extends Component {
  state = {
    jobDetails: {},
    similarJobs: [],
    apiStatus: apiStatusConstants.initial,
  }

  componentDidMount() {
    this.getJobDetails()
  }

  getJobDetails = async () => {
    this.setState({apiStatus: apiStatusConstants.inprogress})
    const jwtToken = Cookies.get('jwt_token')
    const {match} = this.props
    const {params} = match
    const {id} = params
    const apiUrl = `https://apis.ccbp.in/jobs/${id}`

    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    }
    const response = await fetch(apiUrl, options)
    if (response.ok === true) {
      const data = await response.json()
      const updatedJobDetails = {
        companyLogoUrl: data.job_details.company_logo_url,
        companyWebsiteUrl: data.job_details.company_website_url,
        employmentType: data.job_details.employment_type,
        title: data.job_details.title,
        id: data.job_details.id,
        jobDescription: data.job_details.job_description,
        skills: data.job_details.skills.map(skill => ({
          imageUrl: skill.image_url,
          name: skill.name,
        })),
        lifeAtCompany: {
          description: data.job_details.life_at_company.description,
          imageUrl: data.job_details.life_at_company.image_url,
        },
        location: data.job_details.location,
        packagePerAnnum: data.job_details.package_per_annum,
        rating: data.job_details.rating,
      }

      const updatedSimilarJobs = data.similar_jobs.map(job => ({
        companyLogoUrl: job.company_logo_url,
        employmentType: job.employment_type,
        id: job.id,
        jobDescription: job.job_description,
        location: job.location,
        rating: job.rating,
        title: job.title,
      }))
      this.setState({
        jobDetails: updatedJobDetails,
        similarJobs: updatedSimilarJobs,
        apiStatus: apiStatusConstants.success,
      })
    } else {
      this.setState({apiStatus: apiStatusConstants.failure})
    }
  }

  handleRetry = () => {
    this.getJobDetails()
  }

  renderJobItemDetails = () => {
    const {jobDetails} = this.state
    const {
      companyLogoUrl,
      companyWebsiteUrl,
      employmentType,
      jobDescription,
      skills,
      lifeAtCompany,
      location,
      packagePerAnnum,
      rating,
      title,
    } = jobDetails

    return (
      <div className="job-item-details-container">
        <div className="logo-rating-container">
          <img
            src={companyLogoUrl}
            alt="job details company logo"
            className="company-logo"
          />
          <div className="title-rating">
            <h1>{title}</h1>
            <div className="star-rating">
              <IoIosStar className="star-image" />
              <p>{rating}</p>
            </div>
          </div>
        </div>
        <div className="location-jobtype">
          <div className="location-container">
            <IoLocationSharp />
            <p className="location-job">{location}</p>
            <IoBagSharp />
            <p className="location-job">{employmentType}</p>
          </div>
          <p className="package">{packagePerAnnum}</p>
        </div>
        <hr />
        <div className="description-visit">
          <h1>Description</h1>
          <a href={companyWebsiteUrl} target="_blank" rel="noreferrer">
            Visit
          </a>
        </div>
        <p>{jobDescription}</p>
        <h1>Skills</h1>
        <ul className="skills-list">
          {skills.map(Item => (
            <li key={Item.name} className="each-skill">
              <img src={Item.imageUrl} alt={Item.name} />
              <p>{Item.name}</p>
            </li>
          ))}
        </ul>
        <h1>Life at company</h1>
        <div className="image-comapny-des">
          <p>{lifeAtCompany.description}</p>
          <img src={lifeAtCompany.imageUrl} alt="job details company logo" />
        </div>
      </div>
    )
  }

  renderSimilarJobs = () => {
    const {similarJobs} = this.state

    return (
      <>
        <ul className="similar-jobs-list">
          {similarJobs.map(Item => (
            <SimilarJobItem key={Item.id} similarJobs={Item} />
          ))}
        </ul>
      </>
    )
  }

  renderLoadingView = () => (
    <div className="loader-container" data-testid="loader">
      <Loader type="ThreeDots" color="#ffffff" height="50" width="50" />
    </div>
  )

  renderFailureView = () => (
    <div className="failure-view">
      <img
        src="https://assets.ccbp.in/frontend/react-js/failure-img.png"
        alt="failure view"
      />
      <h1>Oops! Something Went Wrong</h1>
      <p>We cannot seem to find the page you are looking for.</p>
      <button type="button" className="retry-btn" onClick={this.handleRetry}>
        Retry
      </button>
    </div>
  )

  renderSuccesView = () => (
    <div className="job-Details-container">
      {this.renderJobItemDetails()}
      <h1>Similar Jobs</h1>
      {this.renderSimilarJobs()}
    </div>
  )

  renderUsingSwitch = () => {
    const {apiStatus} = this.state
    switch (apiStatus) {
      case apiStatusConstants.success:
        return this.renderSuccesView()
      case apiStatusConstants.failure:
        return this.renderFailureView()
      case apiStatusConstants.inprogress:
        return this.renderLoadingView()
      default:
        return null
    }
  }

  render() {
    return (
      <>
        <Header />
        {this.renderUsingSwitch()}
      </>
    )
  }
}

export default JobItemDetails
