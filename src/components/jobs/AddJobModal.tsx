import React, { useState } from 'react';
import { X, Sparkles, Plus, Trash2, CheckCircle2, AlertCircle, FileText } from 'lucide-react';
import { JobRequirement } from '../../types';
import { AIService } from '../../services/aiService';

interface AddJobModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveJob: (job: JobRequirement) => void;
}

export const AddJobModal: React.FC<AddJobModalProps> = ({ isOpen, onClose, onSaveJob }) => {
  const [title, setTitle] = useState('');
  const [department, setDepartment] = useState('Engineering');
  const [location, setLocation] = useState('San Francisco, CA (Hybrid)');
  const [employmentType, setEmploymentType] = useState<JobRequirement['employmentType']>('Full-time');
  const [seniority, setSeniority] = useState<JobRequirement['seniority']>('Senior');
  const [experienceLevel, setExperienceLevel] = useState('4+ years');
  const [educationRequirement, setEducationRequirement] = useState("Bachelor's degree in Computer Science or related technical discipline");
  const [description, setDescription] = useState('');

  // AI extracted fields (editable)
  const [requiredSkills, setRequiredSkills] = useState<string[]>(['React', 'TypeScript', 'Node.js', 'PostgreSQL']);
  const [newSkillInput, setNewSkillInput] = useState('');
  const [preferredSkills, setPreferredSkills] = useState<string[]>(['Docker', 'AWS', 'CI/CD']);
  const [newPrefSkillInput, setNewPrefSkillInput] = useState('');
  const [certifications, setCertifications] = useState<string[]>([]);
  const [newCertInput, setNewCertInput] = useState('');
  const [responsibilities, setResponsibilities] = useState<string[]>([
    'Design and maintain web services and frontend portals',
    'Collaborate with cross-functional teams to deliver weekly features',
  ]);
  const [newRespInput, setNewRespInput] = useState('');

  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analyzedSuccess, setAnalyzedSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const handleAnalyzeWithAI = async () => {
    if (!description.trim() && !title.trim()) {
      setErrorMsg('Please enter a job title and paste the job description text.');
      return;
    }

    setErrorMsg('');
    setIsAnalyzing(true);
    setAnalyzedSuccess(false);

    try {
      const extracted = await AIService.analyzeJobDescription(title, description);

      if (extracted.title) setTitle(extracted.title);
      if (extracted.department) setDepartment(extracted.department);
      if (extracted.location) setLocation(extracted.location);
      if (extracted.employmentType) setEmploymentType(extracted.employmentType);
      if (extracted.seniority) setSeniority(extracted.seniority);
      if (extracted.experienceLevel) setExperienceLevel(extracted.experienceLevel);
      if (extracted.educationRequirement) setEducationRequirement(extracted.educationRequirement);
      if (extracted.requiredSkills && extracted.requiredSkills.length > 0) setRequiredSkills(extracted.requiredSkills);
      if (extracted.preferredSkills && extracted.preferredSkills.length > 0) setPreferredSkills(extracted.preferredSkills);
      if (extracted.certifications) setCertifications(extracted.certifications);
      if (extracted.responsibilities && extracted.responsibilities.length > 0) setResponsibilities(extracted.responsibilities);

      setAnalyzedSuccess(true);
    } catch (err: any) {
      setErrorMsg('Could not complete AI analysis. You can manually fill in the fields below.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleAddSkill = (isPref: boolean = false) => {
    if (isPref) {
      if (newPrefSkillInput.trim() && !preferredSkills.includes(newPrefSkillInput.trim())) {
        setPreferredSkills([...preferredSkills, newPrefSkillInput.trim()]);
        setNewPrefSkillInput('');
      }
    } else {
      if (newSkillInput.trim() && !requiredSkills.includes(newSkillInput.trim())) {
        setRequiredSkills([...requiredSkills, newSkillInput.trim()]);
        setNewSkillInput('');
      }
    }
  };

  const handleRemoveSkill = (skill: string, isPref: boolean = false) => {
    if (isPref) {
      setPreferredSkills(preferredSkills.filter((s) => s !== skill));
    } else {
      setRequiredSkills(requiredSkills.filter((s) => s !== skill));
    }
  };

  const handleAddResp = () => {
    if (newRespInput.trim()) {
      setResponsibilities([...responsibilities, newRespInput.trim()]);
      setNewRespInput('');
    }
  };

  const handleRemoveResp = (idx: number) => {
    setResponsibilities(responsibilities.filter((_, i) => i !== idx));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setErrorMsg('Job title is required.');
      return;
    }

    const newJob: JobRequirement = {
      id: `job-${Date.now().toString(36)}`,
      title: title.trim(),
      department: department.trim(),
      location: location.trim(),
      employmentType,
      seniority,
      experienceLevel: experienceLevel.trim(),
      educationRequirement: educationRequirement.trim(),
      description: description.trim() || `${title} at ${department}`,
      requiredSkills,
      preferredSkills,
      certifications,
      responsibilities,
      technicalRequirements: requiredSkills.map((s) => `Demonstrated proficiency with ${s}`),
      softSkills: ['Problem Solving', 'Effective Communication', 'Team Collaboration'],
      keywords: [...requiredSkills, ...preferredSkills, department, seniority],
      status: 'Active',
      applicantsCount: 0,
      shortlistedCount: 0,
      createdAt: new Date().toISOString().split('T')[0],
    };

    onSaveJob(newJob);
    onClose();
  };

  const handleLoadSampleJD = () => {
    setTitle('Staff AI / Machine Learning Engineer');
    setDepartment('AI Research & Platform');
    setLocation('San Francisco, CA (Hybrid)');
    setEmploymentType('Full-time');
    setSeniority('Senior');
    setExperienceLevel('5+ years');
    setEducationRequirement("Master's or Ph.D. in Computer Science, Machine Learning, or AI");
    setDescription(`We are looking for a Staff AI / Machine Learning Engineer to scale our generative AI pipelines and multimodal agent infrastructure.
    
Key Responsibilities:
- Design and deploy high-throughput LLM inference services using Python, PyTorch, and vLLM.
- Optimize fine-tuning workflows on AWS GPU clusters (EC2 P4/P5, Slurm, Ray).
- Collaborate with software engineers to integrate vector retrieval (Pinecone, pgvector) and RAG architectures.
- Implement comprehensive evaluation frameworks to monitor hallucinations and latency.
    
Requirements:
- 5+ years of production experience in machine learning and Python.
- Deep expertise in PyTorch, Transformer architectures, and vector embeddings.
- Hands-on cloud experience with AWS and Docker.
- Strong grounding in distributed systems and API design.`);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/40 flex items-center justify-center p-4 sm:p-6">
      <div className="bg-white rounded-lg border border-slate-200 shadow-lg max-w-3xl w-full max-h-[90vh] flex flex-col overflow-hidden">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h2 className="text-base font-semibold text-slate-900">Create Job Requisition</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Define the role or use AI to extract structured criteria from your job description.
            </p>
          </div>
          <button
            id="close-add-job-modal-btn"
            onClick={onClose}
            className="p-1.5 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-5 text-xs sm:text-sm">
          {errorMsg && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-md flex items-center gap-2 text-xs">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Quick Sample JD Pill */}
          <div className="flex items-center justify-between bg-slate-50 p-2.5 rounded-lg border border-slate-200/80">
            <span className="text-xs text-slate-600">Want to quickly test with a sample job description?</span>
            <button
              type="button"
              onClick={handleLoadSampleJD}
              className="text-xs font-medium text-blue-600 hover:text-blue-700 underline"
            >
              Fill Sample ML Engineer JD
            </button>
          </div>

          {/* Primary Details Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Job Title <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Senior Software Engineer"
                required
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-md text-slate-800 text-xs sm:text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Department</label>
              <input
                type="text"
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                placeholder="e.g. Engineering, Product"
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-md text-slate-800 text-xs sm:text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Location</label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g. San Francisco, CA (Hybrid) or Remote"
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-md text-slate-800 text-xs sm:text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Employment Type</label>
              <select
                value={employmentType}
                onChange={(e) => setEmploymentType(e.target.value as any)}
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-md text-slate-800 text-xs sm:text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                <option value="Full-time">Full-time</option>
                <option value="Part-time">Part-time</option>
                <option value="Contract">Contract</option>
                <option value="Remote">Remote</option>
                <option value="Hybrid">Hybrid</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Seniority Level</label>
              <select
                value={seniority}
                onChange={(e) => setSeniority(e.target.value as any)}
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-md text-slate-800 text-xs sm:text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                <option value="Junior">Junior (0-2 years)</option>
                <option value="Mid-Level">Mid-Level (2-4 years)</option>
                <option value="Senior">Senior (4-7 years)</option>
                <option value="Lead">Lead / Staff (7+ years)</option>
                <option value="Executive">Executive / Director</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Required Experience</label>
              <input
                type="text"
                value={experienceLevel}
                onChange={(e) => setExperienceLevel(e.target.value)}
                placeholder="e.g. 4+ years"
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-md text-slate-800 text-xs sm:text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Education Requirement</label>
            <input
              type="text"
              value={educationRequirement}
              onChange={(e) => setEducationRequirement(e.target.value)}
              placeholder="e.g. Bachelor's in Computer Science or related field"
              className="w-full px-3 py-2 bg-white border border-slate-200 rounded-md text-slate-800 text-xs sm:text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          {/* Job Description Textarea & AI Extraction Button */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-slate-400" />
                <span>Job Description Content</span>
              </label>
              <button
                type="button"
                id="ai-analyze-jd-btn"
                onClick={handleAnalyzeWithAI}
                disabled={isAnalyzing}
                className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200/80 rounded text-xs font-medium transition-colors disabled:opacity-50"
              >
                <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                <span>{isAnalyzing ? 'Extracting with Gemini AI...' : 'Analyze Job with AI'}</span>
              </button>
            </div>
            <textarea
              rows={5}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Paste your job description text here, then click 'Analyze Job with AI' to automatically extract required skills, qualifications, and responsibilities..."
              className="w-full px-3 py-2 bg-white border border-slate-200 rounded-md text-slate-800 text-xs sm:text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
            {analyzedSuccess && (
              <div className="mt-1.5 flex items-center gap-1.5 text-xs text-emerald-700 font-medium">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>Competencies extracted successfully. Review and adjust below.</span>
              </div>
            )}
          </div>

          {/* Extracted / Editable Skills Section */}
          <div className="space-y-4 pt-2 border-t border-slate-100">
            {/* Required Skills */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Required Technical Skills (High Match Weight)
              </label>
              <div className="flex flex-wrap gap-1.5 mb-2">
                {requiredSkills.map((skill) => (
                  <span
                    key={skill}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-blue-50 text-blue-700 border border-blue-200/70 text-xs font-medium whitespace-nowrap"
                  >
                    <span>{skill}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveSkill(skill, false)}
                      className="text-blue-500 hover:text-blue-800"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newSkillInput}
                  onChange={(e) => setNewSkillInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddSkill(false);
                    }
                  }}
                  placeholder="Add a required skill (e.g. Python, React, SQL)"
                  className="flex-1 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-md text-xs focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
                <button
                  type="button"
                  onClick={() => handleAddSkill(false)}
                  className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium rounded-md"
                >
                  Add Skill
                </button>
              </div>
            </div>

            {/* Preferred Skills */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Preferred Skills (Secondary Weight)
              </label>
              <div className="flex flex-wrap gap-1.5 mb-2">
                {preferredSkills.map((skill) => (
                  <span
                    key={skill}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-slate-100 text-slate-700 border border-slate-200 text-xs font-medium whitespace-nowrap"
                  >
                    <span>{skill}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveSkill(skill, true)}
                      className="text-slate-400 hover:text-slate-700"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newPrefSkillInput}
                  onChange={(e) => setNewPrefSkillInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddSkill(true);
                    }
                  }}
                  placeholder="Add a preferred skill (e.g. Docker, Redis, Kubernetes)"
                  className="flex-1 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-md text-xs focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
                <button
                  type="button"
                  onClick={() => handleAddSkill(true)}
                  className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium rounded-md"
                >
                  Add
                </button>
              </div>
            </div>

            {/* Key Responsibilities */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">Key Responsibilities</label>
              <div className="space-y-1.5 mb-2">
                {responsibilities.map((resp, idx) => (
                  <div key={idx} className="flex items-center justify-between gap-2 p-2 bg-slate-50 rounded border border-slate-200/60 text-xs text-slate-700">
                    <span>• {resp}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveResp(idx)}
                      className="text-slate-400 hover:text-rose-600 shrink-0"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newRespInput}
                  onChange={(e) => setNewRespInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddResp();
                    }
                  }}
                  placeholder="Add responsibility bullet..."
                  className="flex-1 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-md text-xs focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
                <button
                  type="button"
                  onClick={handleAddResp}
                  className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium rounded-md"
                >
                  Add
                </button>
              </div>
            </div>
          </div>
        </form>

        {/* Modal Footer */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-800 bg-white border border-slate-200 rounded-md transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            id="save-job-submit-btn"
            onClick={handleSubmit}
            className="px-4 py-2 text-xs font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-colors shadow-xs"
          >
            Save Job Requisition
          </button>
        </div>
      </div>
    </div>
  );
};
