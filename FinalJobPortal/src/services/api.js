/* eslint-disable no-unused-vars */
import axios from 'axios'

const API_BASE_URL = 'http://localhost:8082'

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
})

// Mock data for when API is not available
const mockJobs = [
  {
    id: 1,
    jobTitle: 'Senior React Developer',
    companyName: 'TechCorp Inc.',
    location: 'Pune',
    jobRole: 'React Developer',
    category: 'Developer',
    experience: '3-5 years',
    salary: '₹15-25 LPA',
    jobType: 'Full-time',
    jobInfo: {
      description: 'We are looking for a Senior React Developer to join our team.',
      requirements: ['React.js', 'JavaScript', 'HTML/CSS', 'Node.js'],
      responsibilities: ['Develop user interfaces', 'Write clean code', 'Collaborate with team']
    },
    postedDate: '2024-01-15'
  },
  {
    id: 2,
    jobTitle: 'Java Developer',
    companyName: 'SoftSolutions',
    location: 'Mumbai',
    jobRole: 'Java Developer',
    category: 'Developer',
    experience: '2-4 years',
    salary: '₹12-20 LPA',
    jobType: 'Full-time',
    jobInfo: {
      description: 'Looking for experienced Java developers.',
      requirements: ['Java', 'Spring Boot', 'MySQL', 'REST APIs'],
      responsibilities: ['Backend development', 'API integration', 'Database design']
    },
    postedDate: '2024-01-14'
  },
  {
    id: 3,
    jobTitle: 'UI/UX Designer',
    companyName: 'DesignStudio',
    location: 'Bangalore',
    jobRole: 'Designer',
    category: 'Design',
    experience: '1-3 years',
    salary: '₹8-15 LPA',
    jobType: 'Full-time',
    jobInfo: {
      description: 'Creative UI/UX Designer needed for innovative projects.',
      requirements: ['Figma', 'Adobe XD', 'Photoshop', 'User Research'],
      responsibilities: ['Design interfaces', 'User research', 'Prototyping']
    },
    postedDate: '2024-01-13'
  }
]

// Job API functions
export const jobAPI = {
  // Get all jobs
  getAllJobs: async () => {
    try {
      const response = await api.get('/jobs/all')
      return response.data
    } catch (error) {
      console.warn('API not available, using mock data')
      return mockJobs
    }
  },

  // Get jobs by role
  getJobsByRole: async (role) => {
    try {
      const response = await api.get(`/jobs/byJobRole/${role}`)
      return response.data
    } catch (error) {
      console.warn('API not available, using mock data')
      return mockJobs.filter(job => job.jobRole.toLowerCase().includes(role.toLowerCase()))
    }
  },

  // Get jobs by category
  getJobsByCategory: async (category) => {
    try {
      const response = await api.get(`/jobs/byCategory/${category}`)
      return response.data
    } catch (error) {
      console.warn('API not available, using mock data')
      return mockJobs.filter(job => job.category.toLowerCase().includes(category.toLowerCase()))
    }
  },

  // Get jobs by location
  getJobsByLocation: async (location) => {
    try {
      const response = await api.get(`/jobs/byLocation/${location}`)
      return response.data
    } catch (error) {
      console.warn('API not available, using mock data')
      return mockJobs.filter(job => job.location.toLowerCase().includes(location.toLowerCase()))
    }
  },

  // Get jobs by id
getJobById: async (id) => {
  try {
    const response = await api.get(`/jobs/${id}`);
    return response.data;
  } catch (error) {
    console.warn('API not available, using mock data');
    // Fix: make sure comparison works even if types mismatch
    return mockJobs.find(job => String(job.id) === String(id));
  }
},



  // Add new job
  addJob: async (jobData) => {
    try {
      const response = await api.post('/jobs/add', jobData)
      return response.data
    } catch (error) {
      console.warn('API not available, simulating job addition')
      // Simulate adding to mock data
      const newJob = { ...jobData, id: Date.now() }
      mockJobs.push(newJob)
      return newJob
    }
  },

  // Update job
  updateJob: async (id, jobData) => {
    try {
      const response = await api.put(`/jobs/update/${id}`, jobData)
      return response.data
    } catch (error) {
      console.warn('API not available, simulating job update')
      const jobIndex = mockJobs.findIndex(job => job.id == id)
      if (jobIndex !== -1) {
        mockJobs[jobIndex] = { ...mockJobs[jobIndex], ...jobData }
        return mockJobs[jobIndex]
      }
      throw error
    }
  },

  // Delete job
  deleteJob: async (id) => {
    try {
      const response = await api.delete(`/jobs/delete/${id}`)
      return response.data
    } catch (error) {
      console.warn('API not available, simulating job deletion')
      const jobIndex = mockJobs.findIndex(job => job.id == id)
      if (jobIndex !== -1) {
        mockJobs.splice(jobIndex, 1)
        return { success: true }
      }
      throw error
    }
  }
}