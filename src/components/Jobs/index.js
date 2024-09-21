import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'
import {Component} from 'react'
import {BsSearch} from 'react-icons/bs'
import Header from '../Header'
import JobItem from '../JobItem'
import './index.css'

const employmentTypesList = [
  {
    label: 'Full Time',
    employmentTypeId: 'FULLTIME',
  },
  {
    label: 'Part Time',
    employmentTypeId: 'PARTTIME',
  },
  {
    label: 'Freelance',
    employmentTypeId: 'FREELANCE',
  },
  {
    label: 'Internship',
    employmentTypeId: 'INTERNSHIP',
  },
]

const salaryRangesList = [
  {
    salaryRangeId: '1000000',
    label: '10 LPA and above',
  },
  {
    salaryRangeId: '2000000',
    label: '20 LPA and above',
  },
  {
    salaryRangeId: '3000000',
    label: '30 LPA and above',
  },
  {
    salaryRangeId: '4000000',
    label: '40 LPA and above',
  },
]

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inprogress: 'INPROGRESS',
}

class Jobs extends Component {
  state = {
    profileData: {},
    jobsList: [],
    selectedEmploymentTypes: [],
    selectedSalaryRange: '',
    searchInput: '',
    profileApiStatus: apiStatusConstants.initial,
    jobsApiStatus: apiStatusConstants.initial,
  }

  componentDidMount() {
    this.getProfileData()
    this.getJobsData()
  }

  getJobsData = async () => {
    this.setState({jobsApiStatus: apiStatusConstants.inprogress})
    const jwtToken = Cookies.get('jwt_token')
    const {
      selectedEmploymentTypes,
      selectedSalaryRange,
      searchInput,
    } = this.state

    const apiUrl = `https://apis.ccbp.in/jobs?employment_type=${selectedEmploymentTypes.join()}&minimum_package=${selectedSalaryRange}&search=${searchInput}`
    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    }
    const response = await fetch(apiUrl, options)
    if (response.ok === true) {
      const data = await response.json()
      const updatedData = data.jobs.map(Item => ({
        companyLogoUrl: Item.company_logo_url,
        employmentType: Item.employment_type,
        id: Item.id,
        jobDescription: Item.job_description,
        location: Item.location,
        packagePerAnnum: Item.package_per_annum,
        rating: Item.rating,
        title: Item.title,
      }))
      this.setState({
        jobsList: updatedData,
        jobsApiStatus: apiStatusConstants.success,
      })
    } else {
      this.setState({jobsApiStatus: apiStatusConstants.failure})
    }
  }

  getProfileData = async () => {
    this.setState({profileApiStatus: apiStatusConstants.inprogress})
    const jwtToken = Cookies.get('jwt_token')
    const apiUrl = 'https://apis.ccbp.in/profile'
    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    }
    const response = await fetch(apiUrl, options)
    if (response.ok === true) {
      const data = await response.json()
      const profileDetails = data.profile_details
      const updatedData = {
        name: profileDetails.name,
        profileImageUrl: profileDetails.profile_image_url,
        shortBio: profileDetails.short_bio,
      }

      this.setState({
        profileData: updatedData,
        profileApiStatus: apiStatusConstants.success,
      })
    } else {
      this.setState({profileApiStatus: apiStatusConstants.failure})
    }
  }

  onChangeEmploymentType = event => {
    const {selectedEmploymentTypes} = this.state
    const newEmployeeValue = event.target.value

    const updatedEmployeeTypes = selectedEmploymentTypes.includes(
      newEmployeeValue,
    )
      ? selectedEmploymentTypes.filter(Item => Item !== newEmployeeValue)
      : [...selectedEmploymentTypes, newEmployeeValue]
    this.setState(
      {selectedEmploymentTypes: updatedEmployeeTypes},
      this.getJobsData,
    )
  }

  onChangeSalaryRange = event => {
    this.setState({selectedSalaryRange: event.target.value}, this.getJobsData)
  }

  onChangingSearchInput = event => {
    const newSearchInput = event.target.value
    this.setState({searchInput: newSearchInput}, this.getJobsData)
  }

  handleRetryJobs = () => {
    this.getJobsData()
  }

  handleRetryProfile = () => {
    this.getProfileData()
  }

  renderLoadingView = () => (
    <div data-testid="loader" className="loading-container">
      <Loader type="ThreeDots" color="#ffffff" height="50" width="50" />
    </div>
  )

  renderProfileFailureView = () => (
    <>
      <button
        type="button"
        className="retry-butn"
        onClick={this.handleRetryProfile}
      >
        Retry
      </button>
    </>
  )

  renderJobsFailureView = () => (
    <div>
      <img
        src="https://assets.ccbp.in/frontend/react-js/failure-img.png"
        alt="failure-view"
      />
      <h1>Oops! Something Went Wrong</h1>
      <p>We cannot seem to find the page you are looking for.</p>
      <button
        type="button"
        className="retry-butn"
        onClick={this.handleRetryJobs}
      >
        Retry
      </button>
    </div>
  )

  renderFilters = () => (
    <div className="filters-container">
      <h1 className="employment-type">Type of Employment</h1>
      {employmentTypesList.map(Item => (
        <div key={Item.employmentTypeId}>
          <input
            type="checkbox"
            id={Item.employmentTypeId}
            value={Item.employmentTypeId}
            onChange={this.onChangeEmploymentType}
          />
          <label htmlFor={Item.employmentTypeId}>{Item.label}</label>
        </div>
      ))}
      <hr className="separating-filter" />
      <h1 className="employment-type">Salary Range</h1>
      {salaryRangesList.map(Item => (
        <div key={Item.salaryRangeId}>
          <input
            type="radio"
            name="salary"
            id={Item.salaryRangeId}
            value={Item.salaryRangeId}
            onChange={this.onChangeSalaryRange}
          />
          <label htmlFor={Item.salaryRangeId}>{Item.label}</label>
        </div>
      ))}
    </div>
  )

  renderProfileSection = () => {
    const {profileData} = this.state
    const {name, profileImageUrl, shortBio} = profileData

    return (
      <div className="profile-container">
        <img src={profileImageUrl} alt="profile" className="bio-image" />
        <h1 className="bio-name">{name}</h1>
        <p>{shortBio}</p>
      </div>
    )
  }

  renderProfileUsingSwitch = () => {
    const {profileApiStatus} = this.state
    switch (profileApiStatus) {
      case apiStatusConstants.success:
        return this.renderProfileSection()
      case apiStatusConstants.failure:
        return this.renderProfileFailureView()
      case apiStatusConstants.inprogress:
        return this.renderLoadingView()
      default:
        return null
    }
  }

  renderNoJobsView = () => (
    <div className="nojobs-container">
      <img
        src="https://assets.ccbp.in/frontend/react-js/no-jobs-img.png"
        alt="no jobs"
      />
      <h1>No Jobs Found</h1>
      <p>We could not find any jobs. Try other filters</p>
    </div>
  )

  renderJobsList = () => {
    const {jobsList} = this.state

    if (jobsList.length === 0) {
      return this.renderNoJobsView()
    }

    return (
      <ul className="jobs-list">
        {jobsList.map(Item => (
          <JobItem key={Item.id} job={Item} />
        ))}
      </ul>
    )
  }

  renderJobsUsingSwitch = () => {
    const {jobsApiStatus} = this.state
    switch (jobsApiStatus) {
      case apiStatusConstants.success:
        return this.renderJobsList()
      case apiStatusConstants.failure:
        return this.renderJobsFailureView()
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
        <div className="jobs-container">
          <div className="sidebar-container">
            {this.renderProfileUsingSwitch()}
            <hr className="separating-filter" />
            {this.renderFilters()}
          </div>
          <div className="right-side">
            <div className="search-bar">
              <input
                type="search"
                placeholder="search"
                onChange={this.onChangingSearchInput}
                onBlur={this.getJobsData}
                className="input-search-style"
              />
              <button
                type="button"
                data-testid="searchButton"
                className="search-button"
              >
                <BsSearch className="search-icon" />
              </button>
            </div>
            {this.renderJobsUsingSwitch()}
          </div>
        </div>
      </>
    )
  }
}

export default Jobs
