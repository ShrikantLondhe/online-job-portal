/* eslint-disable react/prop-types */
import { useState } from 'react'
import { FiMapPin, FiClock, FiDollarSign, FiBookmark, FiExternalLink } from 'react-icons/fi'
import { toast } from 'react-toastify'
import { useAuth } from '../context/AuthContext'
import { savedJobsManager, applicationsManager } from '../utils/localStorage'
import JobApplicationModal from './JobApplicationModal'
import { useNavigate } from 'react-router-dom'

const JobCard = ({ job, onSave, showSaveButton = true }) => {
  const { user } = useAuth()
  const [isApplicationModalOpen, setIsApplicationModalOpen] = useState(false)
  const [isSaved, setIsSaved] = useState(savedJobsManager.isJobSaved(job.id))
  const [hasApplied, setHasApplied] = useState(applicationsManager.hasApplied(job.id))

   const navigate = useNavigate();

  const handleViewDetails = () => {
    navigate(`/job/${job.id}`);
  };

  const handleSaveJob = () => {
    if (!user) {
      toast.error('Please login to save jobs')
      return
    }

    if (savedJobsManager.saveJob(job)) {
      setIsSaved(true)
      toast.success('Job saved successfully!')
      if (onSave) onSave()
    } else {
      toast.info('Job is already saved')
    }
  }

  const handleUnsaveJob = () => {
    savedJobsManager.removeJob(job.id)
    setIsSaved(false)
    toast.success('Job removed from saved jobs')
    if (onSave) onSave()
  }

  const handleApply = () => {
    if (!user) {
      toast.error('Please login to apply for jobs')
      return
    }
    setIsApplicationModalOpen(true)
  }

  const handleApplicationSuccess = () => {
    setHasApplied(true)
    setIsApplicationModalOpen(false)
  }

  return (
    <>
      <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 p-6 border border-gray-100 hover-lift">
        <div className="flex justify-between items-start mb-4">
          <div className="flex-1">
            <h3 className="text-xl font-bold text-gray-800 mb-2">{job.jobTitle}</h3>
            <p className="text-lg text-blue-600 font-semibold mb-1">{job.companyName}</p>
            <div className="flex items-center text-gray-600 text-sm mb-2">
              <FiMapPin className="mr-1" />
              <span>{job.location}</span>
            </div>
          </div>
          
          {showSaveButton && (
            <button
              onClick={isSaved ? handleUnsaveJob : handleSaveJob}
              className={`p-2 rounded-full transition-colors ${
                isSaved 
                  ? 'bg-blue-100 text-blue-600 hover:bg-blue-200' 
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              <FiBookmark className={`h-5 w-5 ${isSaved ? 'fill-current' : ''}`} />
            </button>
          )}
        </div>

        <div className="space-y-3 mb-6">
          <div className="flex items-center text-sm text-gray-600">
            <FiClock className="mr-2 text-gray-400" />
            <span className="bg-gray-100 px-2 py-1 rounded-full text-xs font-medium">
              {job.experience}
            </span>
            <span className="ml-2 bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">
              {job.jobType}
            </span>
          </div>
          
          <div className="flex items-center text-sm text-gray-600">
            <FiDollarSign className="mr-2 text-gray-400" />
            <span className="font-semibold text-green-600">{job.salary}</span>
          </div>

          <div className="flex flex-wrap gap-2">
            <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium">
              {job.category}
            </span>
            <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded-full text-xs font-medium">
              {job.jobRole}
            </span>
          </div>
        </div>

        {job.jobInfo?.description && (
          <p className="text-gray-600 text-sm mb-4 line-clamp-2">
            {job.jobInfo.description}
          </p>
        )}

        <div className="flex gap-3">
          <button
            onClick={handleApply}
            disabled={hasApplied}
            className={`flex-1 px-4 py-2 rounded-lg font-medium transition-colors flex items-center justify-center ${
              hasApplied
                ? 'bg-gray-100 text-gray-600 cursor-not-allowed'
                : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
          >
            {hasApplied ? 'Applied' : 'Apply Now'}
            {!hasApplied && <FiExternalLink className="ml-1 h-4 w-4" />}
          </button>
          
          <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors" onClick={handleViewDetails}>
            View Details
          </button>
        </div>

        {job.postedDate && (
          <p className="text-xs text-gray-400 mt-3">
            Posted on {new Date(job.postedDate).toLocaleDateString()}
          </p>
        )}
      </div>

      <JobApplicationModal
        isOpen={isApplicationModalOpen}
        onClose={() => setIsApplicationModalOpen(false)}
        job={job}
        onSuccess={handleApplicationSuccess}
      />
    </>
  )
}

export default JobCard