import React, { useState } from 'react';
import { Download, Loader2, FileSpreadsheet, FileText } from 'lucide-react';
import { eventsService } from '../../api/services';

export const ExportButton = ({ filters }) => {
  const [exportingFormat, setExportingFormat] = useState(null);

  const handleExport = async (format = 'csv') => {
    try {
      setExportingFormat(format);
      const response = await eventsService.exportEvents(filters, format);

      const mimeType = format === 'excel' ? 'application/vnd.ms-excel' : 'text/csv';
      const defaultExt = format === 'excel' ? 'xls' : 'csv';

      const blob = new Blob([response.data], { type: mimeType });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;

      const contentDisposition = response.headers ? response.headers['content-disposition'] : null;
      let fileName = `nexttrack_events_${Date.now()}.${defaultExt}`;
      if (contentDisposition) {
        const match = contentDisposition.match(/filename="?([^"]+)"?/);
        if (match && match[1]) {
          fileName = match[1];
        }
      }

      link.setAttribute('download', fileName);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error(`Failed to export ${format.toUpperCase()}:`, err);
      alert(`Failed to export ${format.toUpperCase()} logs. Please try again.`);
    } finally {
      setExportingFormat(null);
    }
  };

  return (
    <div className="flex items-center gap-2 shrink-0">
      {/* Export CSV Button */}
      <button
        onClick={() => handleExport('csv')}
        disabled={!!exportingFormat}
        className="flex items-center gap-2 rounded-2xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 font-extrabold px-3.5 py-2.5 text-xs shadow-sm transition-all active:scale-95 disabled:opacity-50 cursor-pointer"
        title="Export telemetry log as CSV file"
      >
        {exportingFormat === 'csv' ? (
          <Loader2 className="h-4 w-4 animate-spin text-indigo-600" />
        ) : (
          <FileText className="h-4 w-4 text-indigo-600" />
        )}
        {exportingFormat === 'csv' ? 'Exporting...' : 'Export CSV'}
      </button>

      {/* Export Excel Button */}
      <button
        onClick={() => handleExport('excel')}
        disabled={!!exportingFormat}
        className="flex items-center gap-2 rounded-2xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 font-extrabold px-3.5 py-2.5 text-xs shadow-sm transition-all active:scale-95 disabled:opacity-50 cursor-pointer"
        title="Export styled Excel spreadsheet"
      >
        {exportingFormat === 'excel' ? (
          <Loader2 className="h-4 w-4 animate-spin text-emerald-600" />
        ) : (
          <FileSpreadsheet className="h-4 w-4 text-emerald-600" />
        )}
        {exportingFormat === 'excel' ? 'Exporting...' : 'Export Excel'}
      </button>
    </div>
  );
};
