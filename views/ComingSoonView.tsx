import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Construction, ArrowLeft } from 'lucide-react';
import { Button } from '../components/ui/Button';

export const ComingSoonView: React.FC = () => {
  const location = useLocation();
  
  // Extract a title from the pathname (e.g. /fellowships -> Fellowships)
  const title = location.pathname.substring(1).replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase());

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-6 fade-in">
      <div className="h-20 w-20 rounded-full bg-slate-800/50 flex items-center justify-center ring-1 ring-slate-700">
        <Construction size={40} className="text-slate-400" />
      </div>
      
      <div className="space-y-2 max-w-md">
        <h1 className="text-3xl font-bold text-white">{title || 'Under Construction'}</h1>
        <p className="text-slate-400">
          This module is currently being built in the lab. Check back soon or join our Discord for updates.
        </p>
      </div>

      <Link to="/explore">
        <Button variant="secondary">
          <ArrowLeft size={16} className="mr-2" /> Return to Lab
        </Button>
      </Link>
    </div>
  );
};