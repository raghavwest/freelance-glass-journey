
import { PlusCircle } from 'lucide-react';
import { Job } from './FreelanceApp';
import { calculatePriorityScore } from '@/lib/utils';

interface SidebarProps {
  jobs: Job[];
  selectedJob: Job | null;
  onSelectJob: (job: Job) => void;
  onAddNewClient: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  jobs,
  selectedJob,
  onSelectJob,
  onAddNewClient
}) => {
  // Get priority level and color based on score
  const getPriorityInfo = (score: number) => {
    if (score > 80) {
      return { level: "Critical", color: "priority-critical" };
    } else if (score > 60) {
      return { level: "High", color: "priority-high" };
    } else if (score > 40) {
      return { level: "Medium", color: "priority-medium" };
    } else {
      return { level: "Low", color: "priority-low" };
    }
  };

  return (
    <div className="w-80 h-full shrink-0 glass-morphism-dark overflow-hidden flex flex-col border-r border-white/5">
      <div className="p-4 border-b border-white/5">
        <button 
          onClick={onAddNewClient}
          className="w-full py-3 px-4 flex items-center justify-center gap-2 bg-primary/90 hover:bg-primary transition-colors duration-300 text-white rounded-md font-medium"
        >
          <PlusCircle size={18} />
          <span>Add New Client</span>
        </button>
      </div>
      
      <div className="flex-1 overflow-hidden">
        <div className="p-4 border-b border-white/5">
          <h2 className="text-gradient font-semibold text-lg">Projects</h2>
        </div>
        
        <div className="overflow-y-auto custom-scrollbar h-[calc(100%-57px)]">
          {jobs.length === 0 ? (
            <div className="p-6 text-center">
              <p className="text-muted-foreground text-sm">
                No projects yet. Add a client to get started.
              </p>
            </div>
          ) : (
            <ul className="p-2">
              {jobs.map(job => {
                const priorityScore = calculatePriorityScore(job);
                const { level, color } = getPriorityInfo(priorityScore);
                
                return (
                  <li 
                    key={job.id} 
                    className={`mb-2 rounded-lg overflow-hidden transition-all duration-300 cursor-pointer
                      ${selectedJob && selectedJob.id === job.id 
                        ? 'ring-1 ring-primary/70 bg-white/[0.07]' 
                        : 'hover:bg-white/[0.05]'}`}
                    onClick={() => onSelectJob(job)}
                  >
                    <div className="p-3">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-medium text-white truncate">{job.clientName}</h3>
                        <div className={`text-xs px-2 py-0.5 rounded-full bg-${color} text-white`}>
                          {level}
                        </div>
                      </div>
                      
                      <p className="text-sm text-muted-foreground mb-2 truncate">{job.primaryJob}</p>
                      
                      <div className="flex justify-between items-center text-xs text-muted-foreground">
                        <p>Due: {new Date(job.deadline).toLocaleDateString()}</p>
                        <p className="truncate max-w-[100px]">{job.discussedPay}</p>
                      </div>
                      
                      {job.tags.length > 0 && (
                        <div className="mt-2 flex flex-wrap gap-1">
                          {job.tags.slice(0, 3).map(tag => (
                            <span key={tag} className="text-xs px-2 py-0.5 rounded-full bg-white/10 text-white/80">
                              {tag}
                            </span>
                          ))}
                          {job.tags.length > 3 && (
                            <span className="text-xs px-2 py-0.5 rounded-full bg-white/10 text-white/80">
                              +{job.tags.length - 3}
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
