
import React from 'react';
import { Button } from "@/components/ui/button";
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Invoice = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-radial p-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6 flex items-center justify-between">
          <Button 
            variant="ghost" 
            className="flex items-center text-white/80 hover:text-white"
            onClick={() => navigate('/')}
          >
            <ArrowLeft className="mr-2" size={16} />
            Back to Projects
          </Button>
          <h1 className="text-2xl font-bold text-white">Invoice Generation</h1>
          <div></div> {/* Empty div for flex spacing */}
        </div>

        <div className="glass-card rounded-xl p-6">
          <div className="text-center py-12">
            <h2 className="text-xl text-white mb-4">Invoice Generation Coming Soon</h2>
            <p className="text-white/70 max-w-md mx-auto">
              This feature is currently under development. Soon you'll be able to automatically generate 
              professional invoices for your completed projects.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Invoice;
