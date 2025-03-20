import React, { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import ClientForm from './ClientForm';
import JobDetails from './JobDetails';
import EmptyState from './EmptyState';
import { calculatePriorityScore } from '@/lib/utils';
import { toast } from "sonner";
import { Calendar as CalendarIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";

export type Tag = string;

export interface Todo {
  id: number;
  text: string;
  completed: boolean;
}

export interface Revision {
  id: number;
  text: string;
  date: string;
}

export interface Job {
  id: number;
  clientName: string;
  email: string;
  timezone: string;
  primaryJob: string;
  description: string;
  deadline: string;
  discussedPay: string;
  clientNotes: string;
  clientFeedback: string;
  meetings: string;
  tags: Tag[];
  detailedPlan?: string;
  todoList: Todo[];
  revisions: Revision[];
}

export interface FormData {
  clientName: string;
  email: string;
  timezone: string;
  primaryJob: string;
  description: string;
  deadline: string;
  discussedPay: string;
  clientNotes: string;
  clientFeedback: string;
  meetings: string;
  tags: Tag[];
}

const FreelanceApp: React.FC = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [showAddClientForm, setShowAddClientForm] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    clientName: '',
    email: '',
    timezone: 'UTC+0:00',
    primaryJob: 'Branding',
    description: '',
    deadline: '',
    discussedPay: '',
    clientNotes: '',
    clientFeedback: '',
    meetings: '',
    tags: [],
  });
  const [todoList, setTodoList] = useState<Todo[]>([]);
  const [currentTime, setCurrentTime] = useState<Record<number, string>>({});
  const [isCompleteDialogOpen, setIsCompleteDialogOpen] = useState(false);
  const [completedJobId, setCompletedJobId] = useState<number | null>(null);
  const navigate = useNavigate();

  // Sort jobs by priority score
  useEffect(() => {
    if (jobs.length > 1) {
      const sortedJobs = [...jobs].sort((a, b) => {
        const scoreA = calculatePriorityScore(a);
        const scoreB = calculatePriorityScore(b);
        return scoreB - scoreA;
      });
      setJobs(sortedJobs);
    }
  }, [jobs.length]);

  // Update client local times every minute
  useEffect(() => {
    const updateClientTimes = () => {
      const times: Record<number, string> = {};
      
      jobs.forEach(job => {
        if (job.timezone) {
          try {
            // Format: UTC+/-XX:XX
            const offset = job.timezone.substring(3); // get +/-XX:XX part
            const sign = offset.charAt(0); // + or -
            const hours = parseInt(offset.substring(1, 3));
            const minutes = parseInt(offset.substring(4, 6));
            
            // Calculate offset in minutes
            const totalMinutes = (sign === '+' ? 1 : -1) * (hours * 60 + minutes);
            
            // Get current UTC time
            const now = new Date();
            
            // Apply offset
            const clientTime = new Date(now.getTime() + totalMinutes * 60000);
            
            // Format time as HH:MM AM/PM
            times[job.id] = clientTime.toLocaleTimeString([], { 
              hour: '2-digit', 
              minute: '2-digit',
              hour12: true
            });
          } catch (error) {
            times[job.id] = 'Invalid timezone';
          }
        }
      });
      
      setCurrentTime(times);
    };
    
    // Initial update
    updateClientTimes();
    
    // Set interval to update every minute
    const interval = setInterval(updateClientTimes, 60000);
    
    // Cleanup interval
    return () => clearInterval(interval);
  }, [jobs]);

  // Update todo list when selected job changes
  useEffect(() => {
    if (selectedJob) {
      setTodoList(selectedJob.todoList || []);
    }
  }, [selectedJob]);

  const handleAddClient = async (newJobData: Job) => {
    setJobs([...jobs, newJobData]);
    setShowAddClientForm(false);
    toast(`${newJobData.clientName}'s project has been added`);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSelectJob = (job: Job) => {
    setSelectedJob(selectedJob && selectedJob.id === job.id ? null : job);
    setShowAddClientForm(false);
    if (job) {
      setTodoList(job.todoList || []);
    }
  };

  const handleAddNewClientClick = () => {
    setShowAddClientForm(true);
    setSelectedJob(null);
  };

  const handleAddTodo = (todo: string) => {
    if (selectedJob) {
      const newTodo = { id: Date.now(), text: todo, completed: false };
      const updatedTodoList = [...todoList, newTodo];
      
      // Update the selected job's todo list
      const updatedJobs = jobs.map(job => {
        if (job.id === selectedJob.id) {
          return { ...job, todoList: updatedTodoList };
        }
        return job;
      });
      
      setJobs(updatedJobs);
      setTodoList(updatedTodoList);
      setSelectedJob({...selectedJob, todoList: updatedTodoList});
    }
  };

  const handleToggleTodo = (todoId: number) => {
    if (selectedJob) {
      const updatedTodoList = todoList.map(todo => {
        if (todo.id === todoId) {
          return { ...todo, completed: !todo.completed };
        }
        return todo;
      });
      
      // Update the selected job's todo list
      const updatedJobs = jobs.map(job => {
        if (job.id === selectedJob.id) {
          return { ...job, todoList: updatedTodoList };
        }
        return job;
      });
      
      setJobs(updatedJobs);
      setTodoList(updatedTodoList);
      setSelectedJob({...selectedJob, todoList: updatedTodoList});
    }
  };

  const handleDeleteTodo = (todoId: number) => {
    if (selectedJob) {
      const updatedTodoList = todoList.filter(todo => todo.id !== todoId);
      
      // Update the selected job's todo list
      const updatedJobs = jobs.map(job => {
        if (job.id === selectedJob.id) {
          return { ...job, todoList: updatedTodoList };
        }
        return job;
      });
      
      setJobs(updatedJobs);
      setTodoList(updatedTodoList);
      setSelectedJob({...selectedJob, todoList: updatedTodoList});
    }
  };

  const handleAddRevision = (text: string) => {
    if (selectedJob) {
      const revision = {
        id: Date.now(),
        text,
        date: new Date().toLocaleDateString()
      };
      
      const updatedRevisions = [...selectedJob.revisions, revision];
      
      // Update the selected job with new revision
      const updatedJobs = jobs.map(job => {
        if (job.id === selectedJob.id) {
          return { ...job, revisions: updatedRevisions };
        }
        return job;
      });
      
      setJobs(updatedJobs);
      
      // Update the selected job
      const updatedJob = updatedJobs.find(job => job.id === selectedJob.id);
      if (updatedJob) {
        setSelectedJob(updatedJob);
      }
      
      toast(`Revision added to ${selectedJob.clientName}'s project`);
    }
  };

  const handleCompleteJob = () => {
    if (selectedJob) {
      setCompletedJobId(selectedJob.id);
      setIsCompleteDialogOpen(true);
    }
  };

  const confirmCompleteJob = (generateInvoice: boolean) => {
    // Remove the job from the list
    const updatedJobs = jobs.filter(job => job.id !== completedJobId);
    setJobs(updatedJobs);
    
    // Get the job name for toast
    const jobName = jobs.find(job => job.id === completedJobId)?.clientName || '';
    
    // Reset selected job
    setSelectedJob(null);
    setIsCompleteDialogOpen(false);
    
    toast(`${jobName}'s project has been completed`, {
      description: "The job has been removed from your list"
    });
    
    // If user wants to generate invoice, navigate to invoice page
    if (generateInvoice) {
      navigate('/invoice');
    }
  };

  return (
    <div className="flex w-full h-screen overflow-hidden bg-gradient-radial">
      <Sidebar 
        jobs={jobs} 
        selectedJob={selectedJob} 
        onSelectJob={handleSelectJob} 
        onAddNewClient={handleAddNewClientClick}
      />
      
      <main className="flex-1 overflow-hidden">
        <div className="w-full h-full overflow-auto custom-scrollbar p-4 md:p-6">
          {showAddClientForm ? (
            <ClientForm 
              formData={formData} 
              onChange={handleInputChange}
              onAddClient={handleAddClient}
              onCancel={() => setShowAddClientForm(false)}
            />
          ) : selectedJob ? (
            <JobDetails 
              job={selectedJob} 
              currentTime={currentTime}
              todoList={todoList}
              onAddTodo={handleAddTodo}
              onToggleTodo={handleToggleTodo}
              onDeleteTodo={handleDeleteTodo}
              onAddRevision={handleAddRevision}
              onCompleteJob={handleCompleteJob}
            />
          ) : (
            <EmptyState onAddClient={handleAddNewClientClick} />
          )}
        </div>
      </main>

      {/* Calendar button (positioned at bottom right) */}
      <button
        className="fixed right-6 bottom-6 w-14 h-14 rounded-full bg-primary/80 hover:bg-primary text-white shadow-lg flex items-center justify-center transition-colors z-10"
        onClick={() => navigate('/calendar')}
        aria-label="View Calendar"
      >
        <CalendarIcon size={24} />
      </button>

      {/* Completion Dialog */}
      <AlertDialog open={isCompleteDialogOpen} onOpenChange={setIsCompleteDialogOpen}>
        <AlertDialogContent className="bg-gray-800 border-gray-700 text-white">
          <AlertDialogHeader>
            <AlertDialogTitle>Job Complete</AlertDialogTitle>
            <AlertDialogDescription className="text-gray-400">
              Continue to invoice generation?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel 
              className="bg-gray-700 text-white hover:bg-gray-600"
              onClick={() => confirmCompleteJob(false)}
            >
              No
            </AlertDialogCancel>
            <AlertDialogAction 
              className="bg-green-600 hover:bg-green-500"
              onClick={() => confirmCompleteJob(true)}
            >
              Yes
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default FreelanceApp;
