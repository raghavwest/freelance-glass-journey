
import React, { useState } from 'react';
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { Job } from "@/components/FreelanceApp";
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogCancel, AlertDialogAction } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { ArrowLeft, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface CalendarPageProps {
  jobs: Job[];
}

const CalendarPage: React.FC<CalendarPageProps> = ({ jobs }) => {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [selectedJobId, setSelectedJobId] = useState<number | null>(null);
  const [isReminderDialogOpen, setIsReminderDialogOpen] = useState(false);
  const [reminderNote, setReminderNote] = useState('');
  const navigate = useNavigate();

  // Function to get jobs that have deadlines on a specific date
  const getJobsForDate = (date: Date | undefined) => {
    if (!date) return [];
    
    return jobs.filter(job => {
      const jobDeadline = new Date(job.deadline);
      return jobDeadline.getDate() === date.getDate() && 
             jobDeadline.getMonth() === date.getMonth() &&
             jobDeadline.getFullYear() === date.getFullYear();
    });
  };

  const jobsForSelectedDate = getJobsForDate(date);

  // Calculate dates that have jobs with deadlines
  const getDayWithJobDeadline = (day: Date) => {
    const jobsForDay = jobs.filter(job => {
      const jobDeadline = new Date(job.deadline);
      return jobDeadline.getDate() === day.getDate() && 
             jobDeadline.getMonth() === day.getMonth() &&
             jobDeadline.getFullYear() === day.getFullYear();
    });
    
    return jobsForDay.length > 0;
  };

  const handleAddReminder = () => {
    if (reminderNote.trim() !== '') {
      toast.success("Reminder added", {
        description: `Reminder set for ${format(date!, "PPP")}`
      });
      setReminderNote('');
      setIsReminderDialogOpen(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-radial p-6">
      <div className="max-w-5xl mx-auto">
        <div className="mb-6 flex items-center justify-between">
          <Button 
            variant="ghost" 
            className="flex items-center text-white/80 hover:text-white"
            onClick={() => navigate('/')}
          >
            <ArrowLeft className="mr-2" size={16} />
            Back to Projects
          </Button>
          <h1 className="text-2xl font-bold text-white">Deadline Calendar</h1>
          <div></div> {/* Empty div for flex spacing */}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="col-span-1 glass-card rounded-xl p-4">
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              className="bg-white/5 rounded-lg border-none text-white pointer-events-auto"
              modifiers={{
                hasDeadline: (day) => getDayWithJobDeadline(day)
              }}
              modifiersStyles={{
                hasDeadline: {
                  fontWeight: "bold",
                  backgroundColor: "rgba(59, 130, 246, 0.2)",
                  color: "#fff",
                  borderRadius: "0.2rem"
                }
              }}
            />
          </div>

          <div className="md:col-span-2 glass-card rounded-xl p-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-white">
                {date ? format(date, "MMMM d, yyyy") : "Select a date"}
              </h2>
              <Button 
                size="sm" 
                variant="outline" 
                onClick={() => setIsReminderDialogOpen(true)}
                className="text-white/80 border-white/20 hover:bg-white/10"
              >
                <Plus size={16} className="mr-2" />
                Add Reminder
              </Button>
            </div>

            <div className="space-y-3 max-h-[400px] overflow-y-auto custom-scrollbar pr-2">
              {jobsForSelectedDate.length > 0 ? (
                jobsForSelectedDate.map(job => (
                  <div 
                    key={job.id} 
                    className="bg-white/10 border border-white/10 rounded-lg p-4 hover:bg-white/15 transition-colors"
                  >
                    <h3 className="font-medium text-white mb-1">{job.clientName}'s Project</h3>
                    <p className="text-white/70 text-sm">{job.primaryJob}</p>
                    <div className="mt-2 flex items-center justify-between">
                      <div className="text-white/60 text-xs">Deadline</div>
                      <div className="bg-blue-500/20 text-blue-300 text-xs px-2 py-0.5 rounded">
                        {format(new Date(job.deadline), "PPP")}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-white/50">
                  <p>No deadlines or reminders for this date</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <AlertDialog open={isReminderDialogOpen} onOpenChange={setIsReminderDialogOpen}>
        <AlertDialogContent className="bg-gray-800 border-gray-700 text-white">
          <AlertDialogHeader>
            <AlertDialogTitle>Add Reminder</AlertDialogTitle>
            <AlertDialogDescription className="text-gray-400">
              Create a reminder for {date ? format(date, "MMMM d, yyyy") : "selected date"}.
            </AlertDialogDescription>
          </AlertDialogHeader>
          
          <div className="my-4">
            <textarea
              className="w-full bg-gray-700 border border-gray-600 rounded-md p-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter reminder details..."
              rows={3}
              value={reminderNote}
              onChange={(e) => setReminderNote(e.target.value)}
            />
          </div>
          
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-gray-700 text-white hover:bg-gray-600">Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleAddReminder} className="bg-blue-600 hover:bg-blue-500">
              Save Reminder
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default CalendarPage;
