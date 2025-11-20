// Saved jobs management
export const savedJobsManager = {
  getSavedJobs: () => {
    const saved = localStorage.getItem('savedJobs')
    return saved ? JSON.parse(saved) : []
  },

  saveJob: (job) => {
    const savedJobs = savedJobsManager.getSavedJobs()
    if (!savedJobs.find(savedJob => savedJob.id === job.id)) {
      savedJobs.push(job)
      localStorage.setItem('savedJobs', JSON.stringify(savedJobs))
      return true
    }
    return false
  },

  removeJob: (jobId) => {
    const savedJobs = savedJobsManager.getSavedJobs()
    const filteredJobs = savedJobs.filter(job => job.id !== jobId)
    localStorage.setItem('savedJobs', JSON.stringify(filteredJobs))
  },

  isJobSaved: (jobId) => {
    const savedJobs = savedJobsManager.getSavedJobs()
    return savedJobs.some(job => job.id === jobId)
  }
}

// Job applications management
export const applicationsManager = {
  getApplications: () => {
    const applications = localStorage.getItem('jobApplications')
    return applications ? JSON.parse(applications) : []
  },

  addApplication: (application) => {
    const applications = applicationsManager.getApplications()
    applications.push({
      ...application,
      id: Date.now(),
      appliedDate: new Date().toISOString()
    })
    localStorage.setItem('jobApplications', JSON.stringify(applications))
  },

  hasApplied: (jobId) => {
    const applications = applicationsManager.getApplications()
    return applications.some(app => app.jobId === jobId)
  }
}