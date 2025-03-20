
import React, { useState } from 'react';
import { Job, Todo } from './FreelanceApp';
import { Check, Clock, Trash2, Calendar, DollarSign, Mail, Globe, CheckCircle2 } from 'lucide-react';

interface JobDetailsProps {
  job: Job;
  currentTime: Record<number, string>;
  todoList: Todo[];
  onAddTodo: (todo: string) => void;
  onToggleTodo: (todoId: number) => void;
  onDeleteTodo: (todoId: number) => void;
  onAddRevision: (text: string) => void;
  onCompleteJob: () => void;
}

const JobDetails: React.FC<JobDetailsProps> = ({
  job,
  currentTime,
  todoList,
  onAddTodo,
  onToggleTodo,
  onDeleteTodo,
  onAddRevision,
  onCompleteJob
}) => {
  const [newTodo, setNewTodo] = useState('');
  const [revisionNotes, setRevisionNotes] = useState('');
  
  const handleAddTodo = () => {
    if (newTodo.trim() !== '') {
      onAddTodo(newTodo);
      setNewTodo('');
    }
  };
  
  const handleAddRevision = () => {
    if (revisionNotes.trim() !== '') {
      onAddRevision(revisionNotes);
      setRevisionNotes('');
    }
  };
  
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleAddTodo();
    }
  };
  
  // Format the detailed plan by preserving newlines
  const formatDetailedPlan = (text: string | undefined) => {
    if (!text) return 'No detailed plan available.';
    
    return text.split('\n').map((line, index) => (
      <React.Fragment key={index}>
        {line}
        <br />
      </React.Fragment>
    ));
  };
  
  // Calculate days remaining
  const calculateDaysRemaining = () => {
    const deadline = new Date(job.deadline);
    const today = new Date();
    const diffTime = deadline.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return 'Overdue';
    if (diffDays === 0) return 'Due today';
    return `${diffDays} day${diffDays !== 1 ? 's' : ''} remaining`;
  };

  return (
    <div className="max-w-5xl mx-auto animate-fade-in">
      <div className="glass-card rounded-xl overflow-hidden">
        <div className="p-6 border-b border-white/10 flex justify-between items-center">
          <div>
            <h2 className="text-gradient text-2xl font-bold mb-1">{job.clientName}'s Project</h2>
            <p className="text-white/60 text-sm flex items-center">
              <Calendar size={14} className="mr-1" />
              {new Date(job.deadline).toLocaleDateString()} 
              <span className="mx-2">•</span>
              <span className={`${
                calculateDaysRemaining() === 'Overdue' ? 'text-red-400' : 
                calculateDaysRemaining() === 'Due today' ? 'text-orange-400' : 'text-white/60'
              }`}>
                {calculateDaysRemaining()}
              </span>
            </p>
          </div>
          <button
            onClick={onCompleteJob}
            className="px-4 py-2 bg-green-500/80 hover:bg-green-500 text-white rounded-md transition-colors flex items-center"
          >
            <CheckCircle2 size={16} className="mr-2" />
            Complete Project
          </button>
        </div>
        
        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left column - Client info & job details */}
            <div className="lg:col-span-2 space-y-6">
              <div className="glass-morphism rounded-lg p-4">
                <h3 className="text-white font-medium mb-3 border-b border-white/10 pb-2">Client Information</h3>
                
                <div className="space-y-3">
                  <div className="flex items-center text-white/80">
                    <Mail size={16} className="mr-2 text-primary/80" />
                    <span>{job.email}</span>
                  </div>
                  
                  <div className="flex items-center text-white/80">
                    <Globe size={16} className="mr-2 text-primary/80" />
                    <span>
                      {job.timezone}
                      {currentTime[job.id] && (
                        <span className="ml-2 px-2 py-0.5 bg-white/10 rounded text-sm flex items-center">
                          <Clock size={12} className="mr-1" />
                          Currently {currentTime[job.id]}
                        </span>
                      )}
                    </span>
                  </div>
                  
                  <div className="flex items-center text-white/80">
                    <DollarSign size={16} className="mr-2 text-primary/80" />
                    <span>{job.discussedPay}</span>
                  </div>
                </div>
              </div>
              
              <div className="glass-morphism rounded-lg p-4">
                <h3 className="text-white font-medium mb-3 border-b border-white/10 pb-2">Project Description</h3>
                <p className="text-white/80 mb-4">{job.description}</p>
                
                {job.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {job.tags.map(tag => (
                      <span key={tag} className="px-3 py-1 bg-white/10 text-white/80 text-sm rounded-full">
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
              
              <div className="glass-morphism rounded-lg p-4">
                <h3 className="text-white font-medium mb-3 border-b border-white/10 pb-2">Project Plan</h3>
                <div className="text-white/80 prose-sm max-w-none leading-relaxed whitespace-pre-line">
                  {formatDetailedPlan(job.detailedPlan)}
                </div>
              </div>
            </div>
            
            {/* Right column - Todo list & revisions */}
            <div className="space-y-6">
              <div className="glass-morphism rounded-lg p-4">
                <h3 className="text-white font-medium mb-3 border-b border-white/10 pb-2">Task List</h3>
                
                <div className="mb-3">
                  <div className="flex">
                    <input
                      type="text"
                      value={newTodo}
                      onChange={(e) => setNewTodo(e.target.value)}
                      onKeyDown={handleKeyDown}
                      placeholder="Add a new task"
                      className="flex-1 input-glass text-white bg-white/5 rounded-l-md py-2 px-3 focus:outline-none"
                    />
                    <button
                      onClick={handleAddTodo}
                      className="bg-primary/80 hover:bg-primary text-white px-3 py-2 rounded-r-md"
                    >
                      Add
                    </button>
                  </div>
                </div>
                
                {todoList.length === 0 ? (
                  <p className="text-white/50 text-center py-4">No tasks yet</p>
                ) : (
                  <ul className="space-y-2 max-h-60 overflow-y-auto custom-scrollbar pr-2">
                    {todoList.map(todo => (
                      <li 
                        key={todo.id} 
                        className={`flex items-center justify-between p-2 rounded-md transition-colors ${
                          todo.completed 
                            ? 'bg-green-500/10 border border-green-500/20' 
                            : 'bg-white/5 border border-white/10 hover:bg-white/10'
                        }`}
                      >
                        <div className="flex items-center">
                          <button
                            onClick={() => onToggleTodo(todo.id)}
                            className={`w-5 h-5 rounded-full flex items-center justify-center mr-3 transition-colors ${
                              todo.completed
                                ? 'bg-green-500 text-white'
                                : 'border border-white/30 hover:border-primary/80'
                            }`}
                          >
                            {todo.completed && <Check size={12} />}
                          </button>
                          <span className={`text-sm ${todo.completed ? 'line-through text-white/50' : 'text-white/80'}`}>
                            {todo.text}
                          </span>
                        </div>
                        <button
                          onClick={() => onDeleteTodo(todo.id)}
                          className="text-white/50 hover:text-white/80 transition-colors"
                        >
                          <Trash2 size={14} />
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              
              <div className="glass-morphism rounded-lg p-4">
                <h3 className="text-white font-medium mb-3 border-b border-white/10 pb-2">Revisions</h3>
                
                <div className="mb-4">
                  <textarea
                    value={revisionNotes}
                    onChange={(e) => setRevisionNotes(e.target.value)}
                    placeholder="Add revision notes"
                    className="w-full input-glass text-white bg-white/5 rounded-md py-2 px-3 focus:outline-none resize-none"
                    rows={3}
                  />
                  <button
                    onClick={handleAddRevision}
                    className="mt-2 w-full bg-primary/80 hover:bg-primary text-white py-2 rounded-md transition-colors"
                  >
                    Save Revision
                  </button>
                </div>
                
                {job.revisions.length === 0 ? (
                  <p className="text-white/50 text-center py-4">No revisions yet</p>
                ) : (
                  <div className="space-y-3 max-h-60 overflow-y-auto custom-scrollbar pr-2">
                    {job.revisions.map(revision => (
                      <div key={revision.id} className="bg-white/5 border border-white/10 rounded-md p-3">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-xs text-white/50">{revision.date}</span>
                        </div>
                        <p className="text-sm text-white/80 whitespace-pre-line">{revision.text}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              
              {job.clientNotes && (
                <div className="glass-morphism rounded-lg p-4">
                  <h3 className="text-white font-medium mb-3 border-b border-white/10 pb-2">Client Notes</h3>
                  <p className="text-white/80 text-sm whitespace-pre-line">{job.clientNotes}</p>
                </div>
              )}
              
              {job.clientFeedback && (
                <div className="glass-morphism rounded-lg p-4">
                  <h3 className="text-white font-medium mb-3 border-b border-white/10 pb-2">Client Feedback</h3>
                  <p className="text-white/80 text-sm whitespace-pre-line">{job.clientFeedback}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobDetails;
