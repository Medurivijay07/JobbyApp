import {IoIosStar} from 'react-icons/io'
import {IoLocationSharp, IoBagSharp} from 'react-icons/io5'
import {Link} from 'react-router-dom'

import './index.css'

const JobItem = props => {
  const {job} = props
  const {
    companyLogoUrl,
    employmentType,
    id,
    jobDescription,
    location,
    packagePerAnnum,
    rating,
    title,
  } = job
  return (
    <li className="eachjob-item">
      <Link to={`/jobs/${id}`} className="link-item">
        <div className="logo-rating-container">
          <img
            src={companyLogoUrl}
            alt="company logo"
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
        <h1>Description</h1>
        <p className="job-description">{jobDescription}</p>
      </Link>
    </li>
  )
}

export default JobItem
