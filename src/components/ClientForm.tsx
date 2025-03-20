
import React, { useState } from 'react';
import { FormData, Job } from './FreelanceApp';
import { X, Plus, Calendar, Mail, Globe, Briefcase, DollarSign, Tag } from 'lucide-react';
import { timezoneOptions } from '@/lib/constants';

interface ClientFormProps {
  formData: FormData;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  onAddClient: (job: Job) => void;
  onCancel: () => void;
}

const ClientForm: React.FC<ClientFormProps> = ({ 
  formData, 
  onChange, 
  onAddClient, 
  onCancel 
}) => {
  const [newTag, setNewTag] = useState('');
  
  // For the Gemini API
  const GEMINI_API_KEY = "AIzaSyA3nNHLn-RLPsU4wRuWA_kLknYyfeCQ19M";
  const GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent";
  
  const handleTagsChange = () => {
    if (newTag.trim() !== '') {
      const updatedTags = [...formData.tags, newTag.trim()];
      
      // Update form data with new tags
      const syntheticEvent = {
        target: {
          name: 'tags',
          value: updatedTags
        }
      } as React.ChangeEvent<HTMLInputElement>;
      
      onChange(syntheticEvent);
      setNewTag('');
    }
  };
  
  const removeTag = (tagToRemove: string) => {
    const updatedTags = formData.tags.filter(tag => tag !== tagToRemove);
    
    // Update form data with filtered tags
    const syntheticEvent = {
      target: {
        name: 'tags',
        value: updatedTags
      }
    } as React.ChangeEvent<HTMLInputElement>;
    
    onChange(syntheticEvent);
  };
  
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleTagsChange();
    }
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // Generate the detailed plan inline
      const description = formData.description;
      const jobType = formData.primaryJob;
      const deadlineDate = formData.deadline;
    
      // Create a prompt for Gemini LLM
      const prompt = `Generate a concise and specific project plan for a ${jobType} project based on this brief: "${description}".
- Give a plan to reach the deadline which is ${deadlineDate}, with proper dates in between from the current date to the deadline date
to achieve something within the each date
-Give this plan in a roadmap format, make it visually pleasing and want the freelancer to work
- Focus on 5 to 7 clear steps.
- Each step should have a short, informative title followed by a one-line explanation.
- Avoid markdown or formatting symbols like ** or bullet points — return plain text only.
- Ensure the steps are directly relevant to the brief and logically ordered.`;

      const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                { text: prompt }
              ]
            }
          ]
        })
      });

      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }

      const data = await response.json();
      
      // Extract the generated text from the response
      const generatedText = data.candidates[0].content.parts[0].text || "No response generated";
      
      // Format the final output
      const finalOutput = `Based on your description "${description}", here's a detailed plan:\n\n${generatedText}`;
      
      // Create new job with form data and generated description
      const newJob: Job = {
        id: Date.now(),
        ...formData,
        detailedPlan: finalOutput,
        todoList: [],
        revisions: []
      };
      
      // Add new job through the callback
      onAddClient(newJob);
      
    } catch (error) {
      console.error("Error generating detailed plan:", error);
      
      // Create job anyway with error message
      const newJob: Job = {
        id: Date.now(),
        ...formData,
        detailedPlan: `Failed to generate detailed plan. Please try again later.`,
        todoList: [],
        revisions: []
      };
      
      onAddClient(newJob);
    }
  };
  
  return (
    <div className="max-w-4xl mx-auto animate-fade-in">
      <div className="glass-card rounded-xl p-6 mb-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-gradient text-2xl font-bold">New Project</h2>
          <button 
            onClick={onCancel}
            className="p-2 rounded-full hover:bg-white/10 transition-colors"
          >
            <X size={20} className="text-white/70" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Client Information Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-white/90 border-b border-white/10 pb-2">
              Client Information
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-white/70">
                  Client Name
                </label>
                <div className="relative">
                  <input
                    type="text"
                    name="clientName"
                    value={formData.clientName}
                    onChange={onChange}
                    required
                    className="w-full input-glass text-white bg-white/5 rounded-md py-2 px-3 focus:outline-none"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="block text-sm font-medium text-white/70">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail size={16} className="text-white/40" />
                  </div>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={onChange}
                    required
                    className="w-full input-glass text-white bg-white/5 rounded-md py-2 pl-10 pr-3 focus:outline-none"
                  />
                </div>
              </div>
              
              <div className="space-y-2 md:col-span-2">
                <label className="block text-sm font-medium text-white/70">
                  Client Timezone
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Globe size={16} className="text-white/40" />
                  </div>
                  <select
                    name="timezone"
                    value={formData.timezone}
                    onChange={onChange}
                    required
                    className="w-full input-glass text-white bg-white/5 rounded-md py-2 pl-10 pr-3 focus:outline-none appearance-none"
                  >
                    {timezoneOptions.map(option => (
                      <option key={option.value} value={option.value} className="bg-background">
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>
          
          {/* Job Information Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-white/90 border-b border-white/10 pb-2">
              Project Details
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-white/70">
                  Project Type
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Briefcase size={16} className="text-white/40" />
                  </div>
                  <select
                    name="primaryJob"
                    value={formData.primaryJob}
                    onChange={onChange}
                    required
                    className="w-full input-glass text-white bg-white/5 rounded-md py-2 pl-10 pr-3 focus:outline-none appearance-none"
                  >
                    <option value="Branding" className="bg-background">Branding</option>
                    <option value="Web Development" className="bg-background">Web Development</option>
                    <option value="Social Media" className="bg-background">Social Media</option>
                    <option value="Other" className="bg-background">Other</option>
                  </select>
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="block text-sm font-medium text-white/70">
                  Deadline
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Calendar size={16} className="text-white/40" />
                  </div>
                  <input
                    type="date"
                    name="deadline"
                    value={formData.deadline}
                    onChange={onChange}
                    required
                    className="w-full input-glass text-white bg-white/5 rounded-md py-2 pl-10 pr-3 focus:outline-none"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="block text-sm font-medium text-white/70">
                  Project Budget
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <DollarSign size={16} className="text-white/40" />
                  </div>
                  <input
                    type="text"
                    name="discussedPay"
                    value={formData.discussedPay}
                    onChange={onChange}
                    placeholder="e.g. $500"
                    required
                    className="w-full input-glass text-white bg-white/5 rounded-md py-2 pl-10 pr-3 focus:outline-none"
                  />
                </div>
              </div>
              
              <div className="space-y-2 md:col-span-2">
                <label className="block text-sm font-medium text-white/70">
                  Project Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={onChange}
                  required
                  rows={4}
                  className="w-full input-glass text-white bg-white/5 rounded-md py-2 px-3 focus:outline-none resize-none"
                  placeholder="Describe the project goals and deliverables..."
                />
              </div>
            </div>
          </div>
          
          {/* Client Notes Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-white/90 border-b border-white/10 pb-2">
              Additional Information
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-white/70">
                  Client Notes
                </label>
                <textarea
                  name="clientNotes"
                  value={formData.clientNotes}
                  onChange={onChange}
                  rows={3}
                  className="w-full input-glass text-white bg-white/5 rounded-md py-2 px-3 focus:outline-none resize-none"
                  placeholder="Any additional notes from the client..."
                />
              </div>
              
              <div className="space-y-2">
                <label className="block text-sm font-medium text-white/70">
                  Client Feedback
                </label>
                <textarea
                  name="clientFeedback"
                  value={formData.clientFeedback}
                  onChange={onChange}
                  rows={3}
                  className="w-full input-glass text-white bg-white/5 rounded-md py-2 px-3 focus:outline-none resize-none"
                  placeholder="Initial feedback or preferences..."
                />
              </div>
              
              <div className="space-y-2 md:col-span-2">
                <label className="block text-sm font-medium text-white/70">
                  Tags
                </label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {formData.tags.map(tag => (
                    <div key={tag} className="flex items-center bg-white/10 text-white rounded-full px-3 py-1">
                      <span className="text-sm">{tag}</span>
                      <button 
                        type="button" 
                        onClick={() => removeTag(tag)}
                        className="ml-2 text-white/70 hover:text-white focus:outline-none"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ))}
                </div>
                
                <div className="relative flex">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Tag size={16} className="text-white/40" />
                  </div>
                  <input
                    type="text"
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Add a tag"
                    className="flex-1 input-glass text-white bg-white/5 rounded-l-md py-2 pl-10 pr-3 focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={handleTagsChange}
                    className="bg-primary/80 hover:bg-primary text-white flex items-center justify-center px-4 rounded-r-md transition-colors"
                  >
                    <Plus size={16} />
                  </button>
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex justify-end space-x-4 pt-4 border-t border-white/10">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 border border-white/20 text-white rounded-md hover:bg-white/5 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-primary hover:bg-primary/90 text-white rounded-md transition-colors"
            >
              Create Project
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ClientForm;
