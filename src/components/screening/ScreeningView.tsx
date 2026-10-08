import React, { useState, useRef } from 'react';
import {
  UploadCloud,
  FileText,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Loader2,
  ArrowRight,
  Briefcase,
  X,
  FileCheck2,
  RotateCcw
} from 'lucide-react';
import { JobRequirement, Candidate, AppSettings } from '../../types';
import { SAMPLE_RESUME_TEXTS } from '../../mock/sampleData';
import { AIService } from '../../services/aiService';

interface ScreeningViewProps {
  jobs: JobRequirement[];
  selectedJobId?: string;
  onSelectCandidate: (candidate: Candidate) => void;
  onSaveCandidate: (candidate: Candidate) => void;
  settings: AppSettings;
}

interface UploadQueueItem {
  id: string;
  file?: File;
  fileName: string;
  fileSize: string;
  text: string;
  status: 'queued' | 'parsing' | 'matching' | 'completed' | 'error';
  progress: number;
  resultCandidate?: Candidate;
  error?: string;
}

export const ScreeningView: React.FC<ScreeningViewProps> = ({
  jobs,
  selectedJobId,
  onSelectCandidate,
  onSaveCandidate,
  settings,
}) => {
  const [currentJobId, setCurrentJobId] = useState<string>(selectedJobId || (jobs[0] ? jobs[0].id : ''));
  const [queue, setQueue] = useState<UploadQueueItem[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    if (selectedJobId && jobs.some((j) => j.id === selectedJobId)) {
      setCurrentJobId(selectedJobId);
    }
  }, [selectedJobId, jobs]);

  const currentJob = jobs.find((j) => j.id === currentJobId) || jobs[0];

  const handleFiles = (files: FileList | null) => {
    if (!files || files.length === 0) return;

    const newItems: UploadQueueItem[] = [];

    Array.from(files).forEach((file) => {
      const id = `upload-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
      const sizeStr = file.size > 1024 * 1024
        ? `${(file.size / (1024 * 1024)).toFixed(1)} MB`
        : `${Math.round(file.size / 1024)} KB`;

      // For text files, attempt quick read; otherwise extract via backend during processing
      if (file.type === 'text/plain' || file.name.endsWith('.txt')) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const textContent = (e.target?.result as string) || '';
          setQueue((prev) =>
            prev.map((item) => (item.id === id ? { ...item, text: textContent } : item))
          );
        };
        reader.readAsText(file);
      }

      newItems.push({
        id,
        file,
        fileName: file.name,
        fileSize: sizeStr,
        text: '',
        status: 'queued',
        progress: 0,
      });
    });

    setQueue((prev) => [...prev, ...newItems]);
  };

  const handleLoadSampleResume = (sample: typeof SAMPLE_RESUME_TEXTS[0]) => {
    const id = `upload-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    const newItem: UploadQueueItem = {
      id,
      fileName: sample.filename,
      fileSize: '142 KB',
      text: sample.text,
      status: 'queued',
      progress: 0,
    };
    setQueue((prev) => [newItem, ...prev]);
  };

  const processQueue = async () => {
    if (!currentJob) return;

    setIsProcessing(true);

    for (let i = 0; i < queue.length; i++) {
      const item = queue[i];
      if (item.status === 'completed') continue;

      // 1. Update status to parsing
      setQueue((prev) =>
        prev.map((q) => (q.id === item.id ? { ...q, status: 'parsing', progress: 30 } : q))
      );

      try {
        let resumeText = item.text;
        // If text is not yet loaded, extract via document parsing service
        if (!resumeText && item.file) {
          try {
            const extracted = await AIService.extractDocumentText(item.file);
            resumeText = extracted.text;
          } catch (extErr) {
            console.warn('Document text extraction error:', extErr);
            resumeText = `Resume file: ${item.fileName}`;
          }
        }
        if (!resumeText) {
          resumeText = `Resume profile for candidate from ${item.fileName}`;
        }

        // Call Gemini server-side resume parser
        const structuredResume = await AIService.parseResume(resumeText, item.fileName);

        // 2. Update status to matching
        setQueue((prev) =>
          prev.map((q) => (q.id === item.id ? { ...q, status: 'matching', progress: 70 } : q))
        );

        // Call Gemini server-side candidate matching
        const evaluation = await AIService.matchCandidate(
          currentJob,
          structuredResume,
          settings.fairScreening,
          settings.scoreWeights
        );

        const initialStatus = evaluation.scores.overall >= 85 ? 'Shortlisted' : 'AI Screened';

        const candidate: Candidate = {
          id: `cand-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
          jobId: currentJob.id,
          jobTitle: currentJob.title,
          resumeFileName: item.fileName,
          resumeFileSize: item.fileSize,
          uploadDate: new Date().toISOString().split('T')[0],
          pipelineStatus: initialStatus,
          recruiterDecision: initialStatus,
          recruiterDecisionDate: new Date().toISOString().split('T')[0],
          structuredResume,
          evaluation,
          notes: '',
        };

        // Save candidate to storage
        onSaveCandidate(candidate);

        // 3. Mark completed
        setQueue((prev) =>
          prev.map((q) =>
            q.id === item.id
              ? { ...q, status: 'completed', progress: 100, resultCandidate: candidate }
              : q
          )
        );
      } catch (err: any) {
        console.error('Screening failed for item:', item.fileName, err);
        setQueue((prev) =>
          prev.map((q) =>
            q.id === item.id
              ? { ...q, status: 'error', progress: 0, error: 'Failed to process resume' }
              : q
          )
        );
      }
    }

    setIsProcessing(false);
  };

  const removeItem = (id: string) => {
    setQueue((prev) => prev.filter((item) => item.id !== id));
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200/60">
        <div>
          <h1 className="text-xl sm:text-2xl font-semibold text-slate-900 tracking-tight">
            Resume Screening & Matching Engine
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Upload candidate resumes to extract structured profiles, calculate explainable scores, and identify skill gaps.
          </p>
        </div>
      </div>

      {/* Select Target Job Requirement */}
      <div className="bg-white p-4 rounded-lg border border-slate-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-md bg-blue-50 text-blue-700 flex items-center justify-center shrink-0">
            <Briefcase className="w-4 h-4" />
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-700 block">Target Job Requisition</label>
            <p className="text-[11px] text-slate-500">Resumes will be matched against criteria of this role</p>
          </div>
        </div>

        <div className="flex-1 max-w-md">
          <select
            id="screening-job-select"
            value={currentJobId}
            onChange={(e) => setCurrentJobId(e.target.value)}
            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-md text-xs sm:text-sm font-medium text-slate-800 focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            {jobs.map((job) => (
              <option key={job.id} value={job.id}>
                {job.title} ({job.department}) — {job.applicantsCount} candidates
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Target Job Quick Summary Card */}
      {currentJob && (
        <div className="bg-slate-50/80 p-4 rounded-lg border border-slate-200/60 text-xs text-slate-600 flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
            <span className="font-semibold text-slate-800">{currentJob.title}</span>
            <span>• Seniority: <strong className="text-slate-700">{currentJob.seniority}</strong></span>
            <span>• Experience: <strong className="text-slate-700">{currentJob.experienceLevel}</strong></span>
            <span>• Required Skills: <strong className="text-slate-700">{currentJob.requiredSkills.slice(0, 4).join(', ')}</strong></span>
          </div>
          <span className="text-[11px] text-blue-700 font-medium bg-blue-50 px-2 py-0.5 rounded border border-blue-200/50">
            {currentJob.requiredSkills.length} competencies measured
          </span>
        </div>
      )}

      {/* Drag & Drop Upload Zone */}
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragOver(false);
          handleFiles(e.dataTransfer.files);
        }}
        onClick={() => fileInputRef.current?.click()}
        className={`bg-white rounded-lg border border-dashed p-8 text-center cursor-pointer transition-colors ${
          dragOver
            ? 'border-blue-500 bg-blue-50/20'
            : 'border-slate-300 hover:border-slate-400 hover:bg-slate-50/40'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept=".pdf,.docx,.doc,.txt"
          onChange={(e) => handleFiles(e.target.files)}
          className="hidden"
        />
        <div className="w-10 h-10 rounded-md bg-slate-100 text-slate-600 mx-auto flex items-center justify-center mb-3">
          <UploadCloud className="w-5 h-5" />
        </div>
        <h3 className="text-sm font-semibold text-slate-900">
          Drop resumes here or click to browse
        </h3>
        <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
          Supports PDF, DOCX, and TXT files. You can upload multiple resumes simultaneously for batch screening.
        </p>

        {/* Quick Sample Buttons */}
        <div className="mt-5 pt-4 border-t border-slate-100 flex flex-wrap items-center justify-center gap-2">
          <span className="text-xs text-slate-400">Quick Test Samples:</span>
          {SAMPLE_RESUME_TEXTS.map((sample, idx) => (
            <button
              key={idx}
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handleLoadSampleResume(sample);
              }}
              className="text-xs font-medium px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-md transition-colors"
            >
              + {sample.title}
            </button>
          ))}
        </div>
      </div>

      {/* Batch Processing Table / Queue */}
      {queue.length > 0 && (
        <div className="bg-white rounded-lg border border-slate-200/80 shadow-xs overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FileCheck2 className="w-4 h-4 text-blue-600" />
              <h3 className="text-sm font-semibold text-slate-900">
                Uploaded Resumes Queue ({queue.length})
              </h3>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setQueue([])}
                className="text-xs text-slate-500 hover:text-slate-700 px-2 py-1 rounded"
              >
                Clear All
              </button>
              <button
                id="start-screening-batch-btn"
                onClick={processQueue}
                disabled={isProcessing || queue.every((q) => q.status === 'completed')}
                className="flex items-center gap-1.5 px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium rounded-md transition-colors disabled:opacity-50 shadow-xs"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Processing Resumes...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Start AI Screening ({queue.filter((q) => q.status !== 'completed').length})</span>
                  </>
                )}
              </button>
            </div>
          </div>

          <div className="divide-y divide-slate-100">
            {queue.map((item) => (
              <div
                key={item.id}
                className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50/60 transition-colors"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-8 h-8 rounded bg-slate-100 text-slate-600 flex items-center justify-center shrink-0">
                    <FileText className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs sm:text-sm font-medium text-slate-900 truncate">
                      {item.fileName}
                    </div>
                    <div className="text-[11px] text-slate-400 flex items-center gap-2 mt-0.5">
                      <span>{item.fileSize}</span>
                      {item.resultCandidate && (
                        <>
                          <span>•</span>
                          <span className="font-semibold text-slate-700">
                            {item.resultCandidate.structuredResume.candidateName}
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {/* Status / Score Column */}
                <div className="flex items-center gap-3 shrink-0 self-end sm:self-auto">
                  {item.status === 'queued' && (
                    <span className="text-xs text-slate-500 bg-slate-100 px-2.5 py-1 rounded">
                      Ready to screen
                    </span>
                  )}

                  {item.status === 'parsing' && (
                    <span className="text-xs text-blue-700 bg-blue-50 px-2.5 py-1 rounded flex items-center gap-1.5 font-medium">
                      <Loader2 className="w-3 h-3 animate-spin text-blue-600" />
                      <span>Parsing structured data...</span>
                    </span>
                  )}

                  {item.status === 'matching' && (
                    <span className="text-xs text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded flex items-center gap-1.5 font-medium">
                      <Sparkles className="w-3 h-3 animate-spin text-indigo-600" />
                      <span>Evaluating match & skill gaps...</span>
                    </span>
                  )}

                  {item.status === 'error' && (
                    <span className="text-xs text-rose-700 bg-rose-50 px-2.5 py-1 rounded flex items-center gap-1">
                      <AlertCircle className="w-3 h-3 text-rose-600" />
                      <span>Failed</span>
                    </span>
                  )}

                  {item.status === 'completed' && item.resultCandidate && (
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-[11px] font-medium px-2 py-0.5 rounded border ${
                          item.resultCandidate.evaluation.scores.overall >= 88
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                            : item.resultCandidate.evaluation.scores.overall >= 75
                            ? 'bg-blue-50 text-blue-700 border-blue-200'
                            : 'bg-slate-50 text-slate-700 border-slate-200'
                        }`}
                      >
                        {item.resultCandidate.evaluation.recommendation}
                      </span>
                      <div className="px-2 py-0.5 bg-slate-800 text-white font-semibold text-xs rounded">
                        {item.resultCandidate.evaluation.scores.overall}%
                      </div>
                      <button
                        onClick={() => onSelectCandidate(item.resultCandidate!)}
                        className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium rounded transition-colors"
                      >
                        View Dossier
                      </button>
                    </div>
                  )}

                  <button
                    onClick={() => removeItem(item.id)}
                    className="p-1 text-slate-400 hover:text-slate-600"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
