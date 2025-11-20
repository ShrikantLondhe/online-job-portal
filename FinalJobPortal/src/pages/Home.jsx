import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { FiSearch, FiMapPin, FiTrendingUp, FiStar, FiBriefcase, FiUsers, FiTarget, FiAward } from 'react-icons/fi'
import { jobAPI } from '../services/api'

const Home = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [location, setLocation] = useState('')
  const [featuredJobs, setFeaturedJobs] = useState([])

  useEffect(() => {
    const fetchFeaturedJobs = async () => {
      try {
        const jobs = await jobAPI.getAllJobs()
        setFeaturedJobs(jobs.slice(0, 3))
      } catch (error) {
        console.error('Error fetching featured jobs:', error)
      }
    }
    fetchFeaturedJobs()
  }, [])

  const jobCategories = [
    { name: 'Developer', icon: '💻', count: '1,200+', color: 'bg-blue-100 text-blue-600' },
    { name: 'Design', icon: '🎨', count: '800+', color: 'bg-purple-100 text-purple-600' },
    { name: 'Marketing', icon: '📈', count: '600+', color: 'bg-green-100 text-green-600' },
    { name: 'Sales', icon: '💼', count: '900+', color: 'bg-orange-100 text-orange-600' },
    { name: 'Finance', icon: '💰', count: '500+', color: 'bg-yellow-100 text-yellow-600' },
    { name: 'HR', icon: '👥', count: '300+', color: 'bg-pink-100 text-pink-600' }
  ]

  const trendingRoles = [
    'React Developer', 'Java Developer', 'Product Manager', 'UI/UX Designer',
    'Data Scientist', 'DevOps Engineer', 'Business Analyst', 'Full Stack Developer'
  ]

  const topCompanies = [
    { name: 'Google', logo: '🌟', jobs: '150+' },
    { name: 'Microsoft', logo: '🔷', jobs: '120+' },
    { name: 'Amazon', logo: '📦', jobs: '200+' },
    { name: 'Netflix', logo: '🎬', jobs: '80+' },
    { name: 'Meta', logo: '👥', jobs: '100+' },
    { name: 'Apple', logo: '🍎', jobs: '90+' }
  ]

  const features = [
    {
      icon: <FiBriefcase className="h-8 w-8" />,
      title: 'Quality Jobs',
      description: 'Access to premium job opportunities from top companies'
    },
    {
      icon: <FiUsers className="h-8 w-8" />,
      title: 'Expert Support',
      description: 'Get guidance from career experts throughout your journey'
    },
    {
      icon: <FiTarget className="h-8 w-8" />,
      title: 'Perfect Match',
      description: 'Advanced matching algorithm to find your ideal role'
    },
    {
      icon: <FiAward className="h-8 w-8" />,
      title: 'Success Rate',
      description: '95% of our users land their dream job within 3 months'
    }
  ]

  const faqs = [
    {
      question: 'How do I create an account?',
      answer: 'Click on the Login button and then select Register to create your account with email and password.'
    },
    {
      question: 'Is the service free?',
      answer: 'Yes, our basic job search and application features are completely free for all users.'
    },
    {
      question: 'How do I apply for jobs?',
      answer: 'Browse jobs, click Apply Now on any job card, fill out the application form, and upload your resume.'
    },
    {
      question: 'Can I save jobs for later?',
      answer: 'Yes, you can bookmark jobs by clicking the bookmark icon on any job card. View saved jobs in your profile.'
    }
  ]

  const handleSearch = (e) => {
    e.preventDefault()
    if (searchTerm.trim() || location.trim()) {
      const params = new URLSearchParams()
      if (searchTerm.trim()) params.set('search', searchTerm.trim())
      if (location.trim()) params.set('location', location.trim())
      window.location.href = `/jobs?${params.toString()}`
    }
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-600 via-purple-600 to-blue-800 text-white py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-10"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl md:text-7xl font-bold mb-6 animate-slide-up">
              Find Your Dream
              <span className="block bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
                Career Today
              </span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 opacity-90 animate-fade-in">
              Connect with top employers and discover opportunities that match your skills and ambitions
            </p>

            {/* Search Form */}
            <form onSubmit={handleSearch} className="bg-white rounded-2xl p-4 md:p-6 shadow-2xl max-w-4xl mx-auto animate-slide-up">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="relative">
                  <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <input
                    type="text"
                    placeholder="Job title, skills, or company"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 text-gray-700 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div className="relative">
                  <FiMapPin className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <input
                    type="text"
                    placeholder="Location"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 text-gray-700 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors font-semibold flex items-center justify-center"
                >
                  <FiSearch className="mr-2" />
                  Search Jobs
                </button>
              </div>
            </form>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16">
              <div className="text-center animate-fade-in">
                <div className="text-3xl md:text-4xl font-bold">10K+</div>
                <div className="text-blue-200">Active Jobs</div>
              </div>
              <div className="text-center animate-fade-in">
                <div className="text-3xl md:text-4xl font-bold">5K+</div>
                <div className="text-blue-200">Companies</div>
              </div>
              <div className="text-center animate-fade-in">
                <div className="text-3xl md:text-4xl font-bold">50K+</div>
                <div className="text-blue-200">Job Seekers</div>
              </div>
              <div className="text-center animate-fade-in">
                <div className="text-3xl md:text-4xl font-bold">95%</div>
                <div className="text-blue-200">Success Rate</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Job Categories */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
              Browse by Category
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Explore opportunities across different industries and find the perfect match for your skills
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {jobCategories.map((category, index) => (
              <Link
                key={index}
                to={`/jobs?category=${category.name}`}
                className="bg-white rounded-xl p-6 text-center hover:shadow-lg transition-all duration-300 hover-lift group"
              >
                <div className={`w-16 h-16 mx-auto mb-4 rounded-full ${category.color} flex items-center justify-center text-2xl group-hover:scale-110 transition-transform`}>
                  {category.icon}
                </div>
                <h3 className="font-semibold text-gray-800 mb-2">{category.name}</h3>
                <p className="text-sm text-gray-500">{category.count} jobs</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Trending Roles */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4 flex items-center justify-center">
              <FiTrendingUp className="mr-4 text-green-600" />
              Trending Job Roles
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Discover the most in-demand positions in todays job market
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-4">
            {trendingRoles.map((role, index) => (
              <Link
                key={index}
                to={`/jobs?role=${role}`}
                className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-full hover:from-blue-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg"
              >
                {role}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Top Companies */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
              Top Companies Hiring
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Join industry leaders and fast-growing startups
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {topCompanies.map((company, index) => (
              <div
                key={index}
                className="bg-white rounded-xl p-6 text-center hover:shadow-lg transition-all duration-300 hover-lift"
              >
                <div className="text-4xl mb-4">{company.logo}</div>
                <h3 className="font-semibold text-gray-800 mb-2">{company.name}</h3>
                <p className="text-sm text-blue-600 font-medium">{company.jobs} jobs</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Jobs */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4 flex items-center justify-center">
              <FiStar className="mr-4 text-yellow-500" />
              Featured Jobs
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Hand-picked opportunities from our partner companies
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {featuredJobs.map((job, index) => (
              <div key={index} className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 hover-lift">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-gray-800 mb-2">{job.jobTitle}</h3>
                    <p className="text-blue-600 font-semibold">{job.companyName}</p>
                    <p className="text-gray-500 flex items-center mt-1">
                      <FiMapPin className="mr-1 h-4 w-4" />
                      {job.location}
                    </p>
                  </div>
                  <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                    {job.jobType}
                  </span>
                </div>
                <p className="text-gray-600 mb-4 line-clamp-2">{job.jobInfo?.description || 'Great opportunity to join our team.'}</p>
                <div className="flex justify-between items-center">
                  <span className="text-green-600 font-bold">{job.salary}</span>
                  <Link
                    to="/jobs"
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Apply Now
                  </Link>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center">
            <Link
              to="/jobs"
              className="inline-flex items-center px-8 py-4 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-semibold text-lg"
            >
              View All Jobs
              <FiSearch className="ml-2" />
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
              Why Choose JobGuru?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Were committed to helping you find the perfect career opportunity
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="text-center">
                <div className="bg-blue-100 text-blue-600 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-4">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How to Apply */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
              How to Apply
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Simple steps to land your dream job
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div className="text-center relative">
                <div className="bg-blue-600 text-white w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                  1
                </div>
                <h3 className="text-lg font-semibold mb-2">Create Account</h3>
                <p className="text-gray-600">Sign up with your email and create your profile</p>
              </div>
              <div className="text-center relative">
                <div className="bg-blue-600 text-white w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                  2
                </div>
                <h3 className="text-lg font-semibold mb-2">Search Jobs</h3>
                <p className="text-gray-600">Browse and filter jobs based on your preferences</p>
              </div>
              <div className="text-center relative">
                <div className="bg-blue-600 text-white w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                  3
                </div>
                <h3 className="text-lg font-semibold mb-2">Apply</h3>
                <p className="text-gray-600">Submit your application with resume and cover letter</p>
              </div>
              <div className="text-center relative">
                <div className="bg-blue-600 text-white w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                  4
                </div>
                <h3 className="text-lg font-semibold mb-2">Get Hired</h3>
                <p className="text-gray-600">Connect with employers and start your new career</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQs */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Get answers to common questions about our platform
            </p>
          </div>

          <div className="max-w-3xl mx-auto space-y-6">
            {faqs.map((faq, index) => (
              <div key={index} className="bg-white rounded-xl p-6 shadow-md">
                <h3 className="text-lg font-semibold text-gray-800 mb-3">{faq.question}</h3>
                <p className="text-gray-600">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Ready to Start Your Journey?
          </h2>
          <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
            Join thousands of professionals who have found their dream careers through JobPortal
          </p>
          <div className="space-x-4">
            <Link
              to="/jobs"
              className="inline-block bg-white text-blue-600 px-8 py-4 rounded-xl font-semibold hover:bg-gray-100 transition-colors"
            >
              Browse Jobs
            </Link>
            <Link
              to="/login"
              className="inline-block border-2 border-white text-white px-8 py-4 rounded-xl font-semibold hover:bg-white hover:text-blue-600 transition-colors"
            >
              Get Started
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <FiBriefcase className="h-8 w-8 text-blue-400" />
                <span className="text-2xl font-bold">JobGuru</span>
              </div>
              <p className="text-gray-400 mb-4">
                Your gateway to amazing career opportunities. Connect with top employers and find your dream job.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">For Job Seekers</h3>
              <ul className="space-y-2 text-gray-400">
                <li><Link to="/jobs" className="hover:text-white transition-colors">Browse Jobs</Link></li>
                <li><Link to="/saved-jobs" className="hover:text-white transition-colors">Saved Jobs</Link></li>
                <li><Link to="/login" className="hover:text-white transition-colors">Create Account</Link></li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">For Employers</h3>
              <ul className="space-y-2 text-gray-400">
                <li><Link to="/admin" className="hover:text-white transition-colors">Post Jobs</Link></li>
                <li><Link to="/admin" className="hover:text-white transition-colors">Manage Jobs</Link></li>
                <li><Link to="/login" className="hover:text-white transition-colors">Employer Login</Link></li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Contact</h3>
              <ul className="space-y-2 text-gray-400">
                <li>📧 support@jobguru.com</li>
                <li>📞 +1 (555) 123-4567</li>
                <li>📍 123 Business Ave, Tech City, TC 12345</li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-700 mt-12 pt-8 text-center text-gray-400">
            <p>&copy; 2025 JobGuru. All rights reserved. Built with ❤️ for job seekers everywhere.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default Home