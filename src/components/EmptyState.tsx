
import React from 'react';
import { FileText, PlusCircle } from 'lucide-react';

interface EmptyStateProps {
  onAddClient: () => void;
}

const EmptyState: React.FC<EmptyStateProps> = ({ onAddClient }) => {
  return (
    <div className="h-[90vh] flex flex-col items-center justify-center animate-fade-in">
      <div className="glass-morphism rounded-xl p-10 max-w-lg w-full text-center">
        <div className="w-20 h-20 rounded-full glass-card mx-auto mb-6 flex items-center justify-center">
          <FileText size={32} className="text-primary" />
        </div>
        
        <h2 className="text-gradient text-3xl font-bold mb-4">Freelance Manager</h2>
        
        <p className="text-white/70 mb-8">
          Keep track of your clients, projects, and deadlines all in one place.
          Organize your freelance work effortlessly.
        </p>
        
        <button
          onClick={onAddClient}
          className="py-3 px-6 bg-primary/90 hover:bg-primary transition-colors text-white rounded-md font-medium inline-flex items-center"
        >
          <PlusCircle size={18} className="mr-2" />
          Add Your First Client
        </button>
      </div>
    </div>
  );
};

export default EmptyState;
