import { useState, useEffect } from 'react'
import { FiPlus, FiEdit, FiTrash2, FiBriefcase, FiUsers, FiTrendingUp, FiMapPin } from 'react-icons/fi'
import { toast } from 'react-toastify'
import { jobAPI } from '../services/api'

const AdminDashboard = () => {
  const [jobs, setJobs] = useState([])
  const [showJobForm, setShowJobForm] = useState(false)
  const [editingJob, setEditingJob] = useState(null)
  const [loading, setLoading] = useState(true)
  const [formData, setFormData] = useState({
    jobTitle: '',
    companyName: '',
    location: '',
    jobRole: '',
    category: '',
    experience: '',
    salary: '',
    jobType: 'Full-time',
    jobInfo: {
      description: '',
      requirements: [],
      responsibilities: []
    }
  })

  useEffect(() => {
    fetchJobs()
  }, [])

  const fetchJobs = async () => {
    try {
      setLoading(true)
      const jobsData = await jobAPI.getAllJobs()
      setJobs(jobsData)
    } catch (error) {
      console.error('Error fetching jobs:', error)
      toast.error('Failed to fetch jobs')
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    
    if (name.startsWith('jobInfo.')) {
      const field = name.split('.')[1]
      setFormData(prev => ({
        ...prev,
        jobInfo: {
          ...prev.jobInfo,
          [field]: value
        }
      }))
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }))
    }
  }

  const handleArrayChange = (field, value) => {
    const items = value.split('\n').filter(item => item.trim())
    setFormData(prev => ({
      ...prev,
      jobInfo: {
        ...prev.jobInfo,
        [field]: items
      }
    }))
  }

  const resetForm = () => {
    setFormData({
      jobTitle: '',
      companyName: '',
      location: '',
      jobRole: '',
      category: '',
      experience: '',
      salary: '',
      jobType: 'Full-time',
      jobInfo: {
        description: '',
        requirements: [],
        responsibilities: []
      }
    })
    setEditingJob(null)
    setShowJobForm(false)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    try {
      const jobData = {
        ...formData,
        postedDate: editingJob ? editingJob.postedDate : new Date().toISOString().split('T')[0]
      }

      if (editingJob) {
        await jobAPI.updateJob(editingJob.id, jobData)
        toast.success('Job updated successfully!')
      } else {
        await jobAPI.addJob(jobData)
        toast.success('Job added successfully!')
      }
      
      fetchJobs()
      resetForm()
    } catch (error) {
      console.error('Error saving job:', error)
      toast.error('Failed to save job')
    }
  }

  const handleEdit = (job) => {
    setEditingJob(job)
    setFormData({
      ...job,
      jobInfo: {
        description: job.jobInfo?.description || '',
        requirements: job.jobInfo?.requirements || [],
        responsibilities: job.jobInfo?.responsibilities || []
      }
    })
    setShowJobForm(true)
  }

  const handleDelete = async (jobId) => {
    if (window.confirm('Are you sure you want to delete this job?')) {
      try {
        await jobAPI.deleteJob(jobId)
        toast.success('Job deleted successfully!')
        fetchJobs()
      } catch (error) {
        console.error('Error deleting job:', error)
        toast.error('Failed to delete job')
      }
    }
  }

  // Calculate statistics
  const totalJobs = jobs.length
  const totalCategories = [...new Set(jobs.map(job => job.category))].length
  const totalLocations = [...new Set(jobs.map(job => job.location))].length
  const recentJobs = jobs.filter(job => {
    const jobDate = new Date(job.postedDate)
    const weekAgo = new Date()
    weekAgo.setDate(weekAgo.getDate() - 7)
    return jobDate >= weekAgo
  }).length

  const statsCards = [
    { title: 'Total Jobs', value: totalJobs, icon: FiBriefcase, color: 'bg-blue-500' },
    { title: 'Categories', value: totalCategories, icon: FiUsers, color: 'bg-green-500' },
    { title: 'Locations', value: totalLocations, icon: FiMapPin, color: 'bg-purple-500' },
    { title: 'This Week', value: recentJobs, icon: FiTrendingUp, color: 'bg-orange-500' }
  ]

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="spinner mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Admin Dashboard</h1>
            <p className="text-gray-600 mt-1">Manage job postings and monitor statistics</p>
          </div>
          <button
            onClick={() => setShowJobForm(true)}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center font-semibold"
          >
            <FiPlus className="mr-2" />
            Add New Job
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statsCards.map((stat, index) => (
            <div key={index} className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow">
              <div className="flex items-center">
                <div className={`${stat.color} text-white p-3 rounded-full mr-4`}>
                  <stat.icon className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-gray-600 text-sm">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-800">{stat.value}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Jobs Table */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-800">All Job Postings</h2>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Job Details
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Company & Location  
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Category & Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Posted Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {jobs.map((job) => (
                  <tr key={job.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{job.jobTitle}</div>
                        <div className="text-sm text-gray-500">{job.jobRole}</div>
                        <div className="text-sm text-green-600 font-medium">{job.salary}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{job.companyName}</div>
                        <div className="text-sm text-gray-500 flex items-center">
                          <FiMapPin className="mr-1 h-3 w-3" />
                          {job.location}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 mb-1">
                          {job.category}
                        </span>
                        <div className="text-sm text-gray-500">{job.jobType}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(job.postedDate).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEdit(job)}
                          className="text-blue-600 hover:text-blue-900 p-2 hover:bg-blue-50 rounded-full transition-colors"
                        >
                          <FiEdit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(job.id)}
                          className="text-red-600 hover:text-red-900 p-2 hover:bg-red-50 rounded-full transition-colors"
                        >
                          <FiTrash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Job Form Modal */}
        {showJobForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-2xl font-bold text-gray-800">
                  {editingJob ? 'Edit Job' : 'Add New Job'}
                </h2>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Job Title *
                    </label>
                    <input
                      type="text"
                      name="jobTitle"
                      value={formData.jobTitle}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Company Name *
                    </label>
                    <input
                      type="text"
                      name="companyName"
                      value={formData.companyName}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Location *
                    </label>
                    <input
                      type="text"
                      name="location"
                      value={formData.location}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Job Role *
                    </label>
                    <input
                      type="text"
                      name="jobRole"
                      value={formData.jobRole}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Category *
                    </label>
                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    >
                      <option value="">Select Category</option>
                      <option value="Developer">Developer</option>
                      <option value="Design">Design</option>
                      <option value="Marketing">Marketing</option>
                      <option value="Sales">Sales</option>
                      <option value="Finance">Finance</option>
                      <option value="HR">HR</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Experience Required *
                    </label>
                    <input
                      type="text"
                      name="experience"
                      value={formData.experience}
                      onChange={handleInputChange}
                      placeholder="e.g., 2-5 years"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Salary *
                    </label>
                    <input
                      type="text"
                      name="salary"
                      value={formData.salary}
                      onChange={handleInputChange}
                      placeholder="e.g., ₹15-25 LPA"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Job Type *
                    </label>
                    <select
                      name="jobType"
                      value={formData.jobType}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    >
                      <option value="Full-time">Full-time</option>
                      <option value="Part-time">Part-time</option>
                      <option value="Contract">Contract</option>
                      <option value="Remote">Remote</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Job Description *
                  </label>
                  <textarea
                    name="jobInfo.description"
                    value={formData.jobInfo.description}
                    onChange={handleInputChange}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Requirements (one per line)
                  </label>
                  <textarea
                    value={formData.jobInfo.requirements.join('\n')}
                    onChange={(e) => handleArrayChange('requirements', e.target.value)}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter each requirement on a new line"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Responsibilities (one per line)
                  </label>
                  <textarea
                    value={formData.jobInfo.responsibilities.join('\n')}
                    onChange={(e) => handleArrayChange('responsibilities', e.target.value)}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter each responsibility on a new line"
                  />
                </div>

                <div className="flex gap-4 pt-4">
                  <button
                    type="button"
                    onClick={resetForm}
                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    {editingJob ? 'Update Job' : 'Add Job'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default AdminDashboard