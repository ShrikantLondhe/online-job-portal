import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { jobAPI } from '../services/api';
import { MapPin, Clock, BadgeIndianRupee } from 'lucide-react';

const JobDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchJob = async () => {
      const jobData = await jobAPI.getJobById(id);
      setJob(jobData);
      setLoading(false);
    };
    fetchJob();
  }, [id]);

  if (loading) return <p className="text-center mt-10">Loading...</p>;
  if (!job) return <p className="text-center mt-10 text-red-500">Job not found</p>;

  return (
    <div className="max-w-4xl mx-auto mt-10 p-6 bg-white rounded-xl shadow-md">
      <button
        onClick={() => navigate(-1)}
        className="mb-4 text-sm text-blue-600 underline hover:text-blue-800"
      >
        ← Back to Job Listings
      </button>

      <h1 className="text-3xl font-semibold text-blue-700 mb-2">{job.jobTitle}</h1>
      <p className="text-lg font-medium text-gray-800 mb-1">{job.companyName}</p>

      <div className="flex items-center text-gray-500 text-sm mb-4 space-x-4">
        <div className="flex items-center gap-1"><MapPin size={16} /> {job.location}</div>
        <div className="flex items-center gap-1"><Clock size={16} /> {job.experience}</div>
        {job.jonInfo?.salary && (
          <div className="flex items-center gap-1"><BadgeIndianRupee size={16} /> {job.jonInfo.salary}</div>
        )}
      </div>

      <div className="flex gap-2 mb-4 flex-wrap">
        {job.category && (
          <span className="bg-blue-100 text-blue-700 px-3 py-1 text-sm rounded-full">{job.category}</span>
        )}
        {job.jobRole && (
          <span className="bg-purple-100 text-purple-700 px-3 py-1 text-sm rounded-full">{job.jobRole}</span>
        )}
        {job.skills && job.skills.split(',').map((skill, i) => (
          <span
            key={i}
            className="bg-gray-100 text-gray-700 px-3 py-1 text-sm rounded-full"
          >
            {skill.trim()}
          </span>
        ))}
      </div>

      <div className="border-t pt-4 text-gray-700 space-y-2 text-sm leading-relaxed">
        <p><strong>Description:</strong> {job.jonInfo?.jobDescription}</p>
        <p><strong>Eligibility:</strong> {job.jonInfo?.eligibility}</p>
        <p><strong>Vacancies:</strong> {job.jonInfo?.vacancies}</p>
        <p><strong>Notice Period:</strong> {job.jonInfo?.noticePeriod}</p>
        <p><strong>Work Mode:</strong> {job.jonInfo?.workMode}</p>
      </div>

      <div className="mt-6 flex gap-4">
        <button
          onClick={() => alert("Application Submitted!")}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-all"
        >
          Apply Now →
        </button>
        <button
          onClick={() => navigate(-1)}
          className="border border-gray-300 px-6 py-2 rounded-lg hover:bg-gray-100 transition-all"
        >
          Go Back
        </button>
      </div>
    </div>
  );
};

export default JobDetail;
