/* eslint-disable no-unused-vars */
import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { FiSearch, FiMapPin, FiFilter, FiGrid, FiList } from 'react-icons/fi'
import { jobAPI } from '../services/api'
import JobCard from '../components/JobCard'

const Jobs = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const [jobs, setJobs] = useState([])
  const [filteredJobs, setFilteredJobs] = useState([])
  const [loading, setLoading] = useState(true)
  const [viewMode, setViewMode] = useState('grid')
  
  // Search and filter states
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '')
  const [location, setLocation] = useState(searchParams.get('location') || '')
  const [category, setCategory] = useState(searchParams.get('category') || '')
  const [experience, setExperience] = useState('')
  const [jobType, setJobType] = useState('')
  const [sortBy, setSortBy] = useState('date')
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1)
  const jobsPerPage = 9

  useEffect(() => {
    fetchJobs()
  }, [])

  useEffect(() => {
    filterJobs()
  }, [jobs, searchTerm, location, category, experience, jobType, sortBy])

  const fetchJobs = async () => {
    try {
      setLoading(true)
      const jobsData = await jobAPI.getAllJobs()
      setJobs(jobsData)
    } catch (error) {
      console.error('Error fetching jobs:', error)
    } finally {
      setLoading(false)
    }
  }

  const filterJobs = () => {
    let filtered = [...jobs]

    // Apply search filters
    if (searchTerm) {
      filtered = filtered.filter(job =>
        job.jobTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.jobRole.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    if (location) {
      filtered = filtered.filter(job =>
        job.location.toLowerCase().includes(location.toLowerCase())
      )
    }

    if (category) {
      filtered = filtered.filter(job =>
        job.category.toLowerCase().includes(category.toLowerCase())
      )
    }

    if (experience) {
      filtered = filtered.filter(job =>
        job.experience.toLowerCase().includes(experience.toLowerCase())
      )
    }

    if (jobType) {
      filtered = filtered.filter(job =>
        job.jobType.toLowerCase().includes(jobType.toLowerCase())
      )
    }

    // Apply sorting
    if (sortBy === 'date') {
      filtered.sort((a, b) => new Date(b.postedDate) - new Date(a.postedDate))
    } else if (sortBy === 'company') {
      filtered.sort((a, b) => a.companyName.localeCompare(b.companyName))
    } else if (sortBy === 'title') {
      filtered.sort((a, b) => a.jobTitle.localeCompare(b.jobTitle))
    }

    setFilteredJobs(filtered)
    setCurrentPage(1) // Reset to first page when filters change
  }

  const handleSearch = (e) => {
    e.preventDefault()
    filterJobs()
  }

  const clearFilters = () => {
    setSearchTerm('')
    setLocation('')
    setCategory('')
    setExperience('')
    setJobType('')
    setSortBy('date')
    setSearchParams({})
  }

  // Pagination logic
  const indexOfLastJob = currentPage * jobsPerPage
  const indexOfFirstJob = indexOfLastJob - jobsPerPage
  const currentJobs = filteredJobs.slice(indexOfFirstJob, indexOfLastJob)
  const totalPages = Math.ceil(filteredJobs.length / jobsPerPage)

  const paginate = (pageNumber) => setCurrentPage(pageNumber)

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="spinner mx-auto mb-4"></div>
          <p className="text-gray-600">Loading jobs...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">Find Your Dream Job</h1>
          <p className="text-xl text-gray-600">Discover opportunities that match your skills and interests</p>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <form onSubmit={handleSearch} className="space-y-4">
            {/* Main search row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="relative">
                <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="text"
                  placeholder="Job title, skills, or company"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div className="relative">
                <FiMapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="text"
                  placeholder="Location"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <button
                type="submit"
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-semibold flex items-center justify-center"
              >
                <FiSearch className="mr-2" />
                Search Jobs
              </button>
            </div>

            {/* Filter row */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">All Categories</option>
                <option value="Developer">Developer</option>
                <option value="Design">Design</option>
                <option value="Marketing">Marketing</option>
                <option value="Sales">Sales</option>
                <option value="Finance">Finance</option>
              </select>

              <select
                value={experience}
                onChange={(e) => setExperience(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">All Experience</option>
                <option value="0-1">0-1 years</option>
                <option value="1-3">1-3 years</option>
                <option value="3-5">3-5 years</option>
                <option value="5+">5+ years</option>
              </select>

              <select
                value={jobType}
                onChange={(e) => setJobType(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">All Types</option>
                <option value="Full-time">Full-time</option>
                <option value="Part-time">Part-time</option>
                <option value="Contract">Contract</option>
                <option value="Remote">Remote</option>
              </select>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="date">Sort by Date</option>
                <option value="company">Sort by Company</option>
                <option value="title">Sort by Title</option>
              </select>

              <button
                type="button"
                onClick={clearFilters}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Clear Filters
              </button>
            </div>
          </form>
        </div>

        {/* Results header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">
              {filteredJobs.length} Jobs Found
            </h2>
            <p className="text-gray-600">
              Showing {indexOfFirstJob + 1}-{Math.min(indexOfLastJob, filteredJobs.length)} of {filteredJobs.length} results
            </p>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="flex bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded ${viewMode === 'grid' ? 'bg-white shadow' : ''}`}
              >
                <FiGrid className="h-5 w-5" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded ${viewMode === 'list' ? 'bg-white shadow' : ''}`}
              >
                <FiList className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Jobs grid */}
        {currentJobs.length > 0 ? (
          <div className={`grid gap-6 mb-8 ${
            viewMode === 'grid' 
              ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' 
              : 'grid-cols-1'
          }`}>
            {currentJobs.map((job) => (
              <JobCard key={job.id} job={job} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="mb-4">
              <FiSearch className="h-16 w-16 text-gray-300 mx-auto" />
            </div>
            <h3 className="text-xl font-semibold text-gray-600 mb-2">No jobs found</h3>
            <p className="text-gray-500 mb-6">
              Try adjusting your search criteria or clearing filters
            </p>
            <button
              onClick={clearFilters}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Clear All Filters
            </button>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center space-x-2">
            <button
              onClick={() => paginate(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
            >
              Previous
            </button>
            
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((number) => (
              <button
                key={number}
                onClick={() => paginate(number)}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  currentPage === number
                    ? 'bg-blue-600 text-white'
                    : 'border border-gray-300 hover:bg-gray-50'
                }`}
              >
                {number}
              </button>
            ))}
            
            <button
              onClick={() => paginate(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default Jobs