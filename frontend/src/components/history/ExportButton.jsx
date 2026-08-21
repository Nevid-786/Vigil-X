import React from 'react';
import { Download } from 'lucide-react';
import { eventsService } from '../../api/services';

export const ExportButton = ({ filters }) => {
  const handleExport = () => {
    const url = eventsService.getExportUrl(filters);
    window.open(url, '_blank');
  };

  return (
    <button
      onClick={handleExport}
      className="flex items-center gap-2 rounded-2xl bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/40 font-extrabold px-4 py-2.5 text-xs shadow-md transition-all active:scale-95 cursor-pointer shrink-0"
    >
      <Download className="h-4 w-4" />
      Export CSV Log
    </button>
  );
};
