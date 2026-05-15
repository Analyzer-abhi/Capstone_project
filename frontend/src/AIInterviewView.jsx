import React, { useState, useRef, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, Loader2, MessageSquare, Send, FileText, Award, TrendingUp, AlertCircle } from 'lucide-react';
import { uploadResumeForInterview, startInterview, sendInterviewMessage, endInterview } from './api';

export default function AIInterviewView({ onBack }) {
  const [step, setStep] = useState('setup'); // setup, interview, report
  const [file, setFile] = useState(null);
  const [userName, setUserName] = useState('');
  const [jobRole, setJobRole] = useState('');
  const [duration, setDuration] = useState(5); // in minutes
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Interview state
  const [interviewId, setInterviewId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [userInput, setUserInput] = useState('');
  const [sending, setSending] = useState(false);
  const [interviewEnded, setInterviewEnded] = useState(false);
  
  // Timer state
  const [timeRemaining, setTimeRemaining] = useState(0); // in seconds
  const [timerInterval, setTimerInterval] = useState(null);
  
  // Report state
  const [report, setReport] = useState(null);
  
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: { 'application/pdf': ['.pdf'], 'text/plain': ['.txt'] },
    maxFiles: 1,
    onDrop: (accepted) => setFile(accepted[0] || null),
  });

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Timer effect
  useEffect(() => {
    if (timeRemaining > 0 && !interviewEnded) {
      const interval = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            clearInterval(interval);
            handleTimeUp();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      setTimerInterval(interval);
      
      return () => clearInterval(interval);
    }
  }, [timeRemaining, interviewEnded]);

  function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  }

  function handleTimeUp() {
    setInterviewEnded(true);
    if (timerInterval) {
      clearInterval(timerInterval);
    }
  }

  async function handleStartInterview(e) {
    e.preventDefault();
    setError('');
    
    if (!file || !jobRole.trim() || !userName.trim()) {
      setError('Please fill in all fields and upload your resume.');
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('resume', file);
      formData.append('jobRole', jobRole.trim());
      formData.append('userName', userName.trim());
      formData.append('duration', duration);
      
      const data = await startInterview(formData);
      setInterviewId(data.interviewId);
      setMessages(data.messages || []);
      setTimeRemaining(duration * 60); // Convert minutes to seconds
      setStep('interview');
    } catch (err) {
      setError(err.message || 'Failed to start interview.');
    } finally {
      setLoading(false);
    }
  }

  async function handleSendMessage(e) {
    e.preventDefault();
    if (!userInput.trim() || sending) return;

    const userMessage = userInput.trim();
    setUserInput('');
    setSending(true);
    setError('');

    // Add user message immediately
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);

    try {
      const data = await sendInterviewMessage(interviewId, userMessage);
      
      // Add AI response
      setMessages(prev => [...prev, { role: 'assistant', content: data.response }]);
      
      // Check if interview should end
      if (data.shouldEnd) {
        setInterviewEnded(true);
      }
    } catch (err) {
      setError(err.message || 'Failed to send message.');
      // Remove the user message if sending failed
      setMessages(prev => prev.slice(0, -1));
      setUserInput(userMessage);
    } finally {
      setSending(false);
    }
  }

  async function handleEndInterview() {
    setLoading(true);
    setError('');
    
    try {
      const data = await endInterview(interviewId);
      setReport(data.report);
      setStep('report');
    } catch (err) {
      setError(err.message || 'Failed to generate report.');
    } finally {
      setLoading(false);
    }
  }

  function handleReset() {
    setStep('setup');
    setFile(null);
    setUserName('');
    setJobRole('');
    setDuration(5);
    setInterviewId(null);
    setMessages([]);
    setUserInput('');
    setInterviewEnded(false);
    setTimeRemaining(0);
    setReport(null);
    setError('');
    if (timerInterval) {
      clearInterval(timerInterval);
    }
  }

  return (
    <div className="ai-interview-view">
      <header className="header section-header">
        <button className="btn btn-ghost back-home-btn" onClick={onBack}>
          ← Home
        </button>
        <div className="logo">
          <MessageSquare size={28} strokeWidth={2} />
          <h1>AI Interview Coaching</h1>
        </div>
        <p className="tagline">Practice live interview responses, get instant feedback, and build confidence for technical and behavioral questions.</p>
      </header>

      {step === 'setup' && (
        <form className="card form-card interview-setup-card" onSubmit={handleStartInterview}>
          <h2>Setup Your Interview</h2>
          <p className="card-subtitle">Fill in your details to start the interview with John</p>

          <div className="form-row">
            <label className="label">
              <FileText size={18} /> Your Name
            </label>
            <input
              type="text"
              placeholder="e.g. Alex Johnson"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              className="input"
              disabled={loading}
            />
          </div>

          <div className="form-row">
            <label className="label">
              <FileText size={18} /> Job Role
            </label>
            <input
              type="text"
              placeholder="e.g. Software Engineer, Data Scientist, Product Manager"
              value={jobRole}
              onChange={(e) => setJobRole(e.target.value)}
              className="input"
              disabled={loading}
            />
          </div>

          <div className="form-row">
            <label className="label">
              <FileText size={18} /> Interview Duration
            </label>
            <select
              value={duration}
              onChange={(e) => setDuration(Number(e.target.value))}
              className="filter-select"
              disabled={loading}
            >
              {[1, 2, 3, 5, 10, 15, 20, 25, 30].map(min => (
                <option key={min} value={min}>{min} minute{min > 1 ? 's' : ''}</option>
              ))}
            </select>
          </div>

          <div className="form-row">
            <span className="label">
              <Upload size={18} /> Resume (PDF or TXT)
            </span>
            <div
              {...getRootProps()}
              className={`dropzone ${isDragActive ? 'active' : ''} ${file ? 'has-file' : ''}`}
            >
              <input {...getInputProps()} />
              {file ? (
                <span className="file-name">{file.name}</span>
              ) : (
                <span>Drop your resume here or click to browse</span>
              )}
            </div>
          </div>

          {error && <p className="error">{error}</p>}

          <div className="interview-info">
            <AlertCircle size={20} />
            <div>
              <strong>What to expect:</strong>
              <ul>
                <li>Your interviewer will be John</li>
                <li>Questions based on your resume and the job role</li>
                <li>Mix of technical and behavioral questions</li>
                <li>Real-time conversation with AI interviewer</li>
                <li>Detailed feedback report at the end</li>
              </ul>
            </div>
          </div>

          <button type="submit" className="btn btn-primary btn-large" disabled={loading}>
            {loading ? (
              <>
                <Loader2 size={20} className="spin" /> Starting Interview...
              </>
            ) : (
              <>
                <MessageSquare size={20} /> Start Interview
              </>
            )}
          </button>
        </form>
      )}

      {step === 'interview' && (
        <div className="interview-chat-container">
          <div className="interview-header">
            <div className="interview-info-bar">
              <div className="interview-participants">
                <span className="participant-name">👤 {userName}</span>
                <span className="vs-text">vs</span>
                <span className="participant-name interviewer">🤖 John (Interviewer)</span>
              </div>
              <div className="interview-meta">
                <span className="interview-role">Role: {jobRole}</span>
                <span className={`interview-timer ${timeRemaining < 60 ? 'timer-warning' : ''}`}>
                  ⏱️ {formatTime(timeRemaining)}
                </span>
              </div>
            </div>
          </div>

          <div className="chat-messages">
            {messages.map((msg, idx) => (
              <div key={idx} className={`chat-message ${msg.role}`}>
                <div className="message-avatar">
                  {msg.role === 'assistant' ? '🤖' : '👤'}
                </div>
                <div className="message-content">
                  <div className="message-sender">
                    {msg.role === 'assistant' ? 'John' : userName}
                  </div>
                  <p>{msg.content}</p>
                </div>
              </div>
            ))}
            {sending && (
              <div className="chat-message assistant">
                <div className="message-avatar">🤖</div>
                <div className="message-content">
                  <div className="message-sender">John</div>
                  <div className="typing-indicator">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {error && <p className="error chat-error">{error}</p>}

          {!interviewEnded ? (
            <form className="chat-input-form" onSubmit={handleSendMessage}>
              <input
                ref={inputRef}
                type="text"
                placeholder="Type your answer..."
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                className="chat-input"
                disabled={sending}
              />
              <button type="submit" className="chat-send-btn" disabled={sending || !userInput.trim()}>
                <Send size={20} />
              </button>
            </form>
          ) : (
            <div className="interview-end-actions">
              <p className="interview-end-message">
                {timeRemaining === 0 ? 'Time\'s up! Interview completed.' : 'Interview completed!'}
              </p>
              <button className="btn btn-primary btn-large" onClick={handleEndInterview} disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 size={20} className="spin" /> Generating Report...
                  </>
                ) : (
                  <>
                    <Award size={20} /> View Report
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      )}

      {step === 'report' && report && (
        <div className="interview-report">
          <div className="card report-header-card">
            <div className="report-header">
              <Award size={48} className="report-icon" />
              <div>
                <h2>Interview Report</h2>
                <p className="report-subtitle">Role: {jobRole}</p>
              </div>
            </div>
            <div className="report-score">
              <div className="score-circle">
                <span className="score-value">{report.overallScore}</span>
                <span className="score-label">/100</span>
              </div>
              <p className="score-description">{report.performanceLevel}</p>
            </div>
          </div>

          <div className="card">
            <h3><TrendingUp size={20} /> Strengths</h3>
            <ul className="report-list">
              {report.strengths.map((strength, idx) => (
                <li key={idx} className="strength-item">{strength}</li>
              ))}
            </ul>
          </div>

          <div className="card">
            <h3><AlertCircle size={20} /> Areas for Improvement</h3>
            <ul className="report-list">
              {report.improvements.map((improvement, idx) => (
                <li key={idx} className="improvement-item">{improvement}</li>
              ))}
            </ul>
          </div>

          <div className="card">
            <h3>Detailed Feedback</h3>
            <p className="report-feedback">{report.detailedFeedback}</p>
          </div>

          <div className="card">
            <h3>Recommendations</h3>
            <ul className="report-list">
              {report.recommendations.map((rec, idx) => (
                <li key={idx}>{rec}</li>
              ))}
            </ul>
          </div>

          <div className="report-actions">
            <button className="btn btn-primary" onClick={handleReset}>
              Start New Interview
            </button>
            <button className="btn btn-ghost" onClick={onBack}>
              Back to Home
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
