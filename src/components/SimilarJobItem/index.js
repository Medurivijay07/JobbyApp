import {IoIosStar} from 'react-icons/io'
import {IoLocationSharp, IoBagSharp} from 'react-icons/io5'
import './index.css'

const SimilarJobItem = props => {
  const {similarJobs} = props
  const {
    companyLogoUrl,
    employmentType,
    jobDescription,
    location,
    rating,
    title,
  } = similarJobs
  return (
    <li className="each-item">
      <div className="logo-rating-container">
        <img
          src={companyLogoUrl}
          alt="similar job company logo"
          className="company-logo"
        />
        <div className="title-rating">
          <p>{title}</p>
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
      </div>
      <hr />
      <h1>Description</h1>
      <p className="job-description">{jobDescription}</p>
    </li>
  )
}

export default SimilarJobItem
