import { useState, useEffect } from 'react'
import { FiBookmark, FiTrash2, FiSearch } from 'react-icons/fi'
import { toast } from 'react-toastify'
import { savedJobsManager } from '../utils/localStorage'
import JobCard from '../components/JobCard'

const SavedJobs = () => {
  const [savedJobs, setSavedJobs] = useState([])
  const [filteredJobs, setFilteredJobs] = useState([])
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    loadSavedJobs()
  }, [])

  useEffect(() => {
    filterJobs()
  }, [savedJobs, searchTerm])

  const loadSavedJobs = () => {
    const jobs = savedJobsManager.getSavedJobs()
    setSavedJobs(jobs)
  }

  const filterJobs = () => {
    if (!searchTerm) {
      setFilteredJobs(savedJobs)
    } else {
      const filtered = savedJobs.filter(job =>
        job.jobTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.location.toLowerCase().includes(searchTerm.toLowerCase())
      )
      setFilteredJobs(filtered)
    }
  }

  const handleRemoveJob = (jobId) => {
    savedJobsManager.removeJob(jobId)
    loadSavedJobs()
    toast.success('Job removed from saved jobs')
  }

  const clearAllSavedJobs = () => {
    if (window.confirm('Are you sure you want to remove all saved jobs?')) {
      localStorage.removeItem('savedJobs')
      setSavedJobs([])
      toast.success('All saved jobs cleared')
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <FiBookmark className="h-8 w-8 text-blue-600 mr-3" />
              <div>
                <h1 className="text-3xl font-bold text-gray-800">Saved Jobs</h1>
                <p className="text-gray-600 mt-1">
                  {savedJobs.length} job{savedJobs.length !== 1 ? 's' : ''} saved
                </p>
              </div>
            </div>
            
            {savedJobs.length > 0 && (
              <button
                onClick={clearAllSavedJobs}
                className="flex items-center px-4 py-2 text-red-600 border border-red-300 rounded-lg hover:bg-red-50 transition-colors"
              >
                <FiTrash2 className="mr-2 h-4 w-4" />
                Clear All
              </button>
            )}
          </div>

          {/* Search */}
          {savedJobs.length > 0 && (
            <div className="relative">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Search saved jobs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          )}
        </div>

        {/* Jobs Grid */}
        {filteredJobs.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredJobs.map((job) => (
              <div key={job.id} className="relative">
                <JobCard 
                  job={job} 
                  onSave={loadSavedJobs}
                  showSaveButton={false}
                />
                <button
                  onClick={() => handleRemoveJob(job.id)}
                  className="absolute top-4 right-4 p-2 bg-red-100 text-red-600 rounded-full hover:bg-red-200 transition-colors"
                  title="Remove from saved jobs"
                >
                  <FiTrash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        ) : savedJobs.length === 0 ? (
          <div className="text-center py-16">
            <div className="mb-6">
              <FiBookmark className="h-24 w-24 text-gray-300 mx-auto" />
            </div>
            <h3 className="text-2xl font-semibold text-gray-600 mb-4">No Saved Jobs Yet</h3>
            <p className="text-gray-500 mb-8 max-w-md mx-auto">
              Start browsing jobs and click the bookmark icon to save jobs youre interested in.
            </p>
            <div className="space-x-4">
              <a
                href="/jobs"
                className="inline-block bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors font-semibold"
              >
                Browse Jobs
              </a>
            </div>
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="mb-6">
              <FiSearch className="h-16 w-16 text-gray-300 mx-auto" />
            </div>
            <h3 className="text-xl font-semibold text-gray-600 mb-2">No jobs match your search</h3>
            <p className="text-gray-500 mb-6">
              Try searching with different keywords
            </p>
            <button
              onClick={() => setSearchTerm('')}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Clear Search
            </button>
          </div>
        )}

        {/* Quick Actions */}
        {savedJobs.length > 0 && (
          <div className="mt-12 bg-blue-50 rounded-2xl p-8 text-center">
            <h3 className="text-xl font-semibold text-blue-900 mb-4">
              Ready to Apply?
            </h3>
            <p className="text-blue-700 mb-6">
              You have {savedJobs.length} saved job{savedJobs.length !== 1 ? 's' : ''}. 
              Start applying to increase your chances of landing your dream job!
            </p>
            <div className="space-x-4">
              <a
                href="/jobs"
                className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Browse More Jobs
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default SavedJobs