import React, { useState, useRef } from 'react';
import { useApp } from '../context/AppContext';
import {
  exportAllDataJSON,
  importAllDataJSON,
  exportLogsToCSV
} from '../services/persistenceService';
import {
  Download,
  Upload,
  FileSpreadsheet,
  FileJson,
  CheckCircle2,
  AlertTriangle,
  HardDrive
} from 'lucide-react';

export const BackupRestoreView: React.FC = () => {
  const { allLogs, refreshAllLogs } = useApp();
  const [importStatus, setImportStatus] = useState<{ success?: boolean; message?: string } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // CSV Export handler
  const handleExportCSV = async () => {
    try {
      const csv = await exportLogsToCSV();
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `messmate_meal_logs_${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (e: any) {
      alert(`CSV Export failed: ${e?.message}`);
    }
  };

  // JSON Export handler
  const handleExportJSON = async () => {
    try {
      const json = await exportAllDataJSON();
      const blob = new Blob([json], { type: 'application/json;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `messmate_full_backup_${new Date().toISOString().split('T')[0]}.json`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (e: any) {
      alert(`JSON Export failed: ${e?.message}`);
    }
  };

  // JSON Import handler
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const text = event.target?.result as string;
        const result = await importAllDataJSON(text);
        setImportStatus(result);
        if (result.success) {
          await refreshAllLogs();
        }
      } catch (err: any) {
        setImportStatus({ success: false, message: `Failed to read file: ${err?.message}` });
      }
    };
    reader.readAsText(file);
    // Reset file input
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="rounded-2xl bg-white border border-[#E8E2D5] p-5 sm:p-6 shadow-sm flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="font-serif text-2xl text-[#221F1D]">
            Data Export & Backup
          </h2>
          <p className="text-xs text-[#7A7265] mt-1">
            MessMate stores all your meals locally in your browser. Safeguard your history anytime with exports.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-medium px-3 py-1.5 rounded-xl bg-[#FAF7F2] text-[#554E45] border border-[#E8E2D5]">
          <HardDrive className="w-3.5 h-3.5 text-[#C85A32]" />
          <span>Local IndexedDB Active</span>
        </div>
      </div>

      {/* Export Options Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* CSV Export Card */}
        <div className="rounded-2xl bg-white border border-[#E8E2D5] p-6 shadow-sm flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2.5 rounded-xl bg-[#FAF7F2] text-[#2D6A4F] border border-[#E8E2D5]">
                <FileSpreadsheet className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-serif text-lg text-[#221F1D]">Export Daily Logs (CSV)</h3>
                <span className="text-xs text-[#7A7265]">Excel & Google Sheets compatible</span>
              </div>
            </div>
            <p className="text-xs text-[#7A7265] mt-3 leading-relaxed">
              Export all your confirmed meal logs, portion sizes, calories, and macronutrient breakdowns into a standard spreadsheet table. Ideal for personal analysis or sharing with fitness mentors.
            </p>
          </div>

          <button
            onClick={handleExportCSV}
            className="w-full py-2.5 rounded-xl bg-[#2D6A4F] hover:bg-[#23553F] text-white font-medium text-xs sm:text-sm flex items-center justify-center gap-2 shadow-sm transition-all"
          >
            <Download className="w-4 h-4" />
            <span>Download CSV Spreadsheet ({allLogs.length} logs)</span>
          </button>
        </div>

        {/* JSON Full Backup Card */}
        <div className="rounded-2xl bg-white border border-[#E8E2D5] p-6 shadow-sm flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2.5 rounded-xl bg-[#FAF7F2] text-[#C85A32] border border-[#E8E2D5]">
                <FileJson className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-serif text-lg text-[#221F1D]">Full Database Backup (JSON)</h3>
                <span className="text-xs text-[#7A7265]">Complete application state snapshot</span>
              </div>
            </div>
            <p className="text-xs text-[#7A7265] mt-3 leading-relaxed">
              Downloads a 100% complete snapshot of your user profile, BMR targets, custom foods, date-specific mess menus, and all daily meal logs. Use this to transfer your data to another device or browser.
            </p>
          </div>

          <button
            onClick={handleExportJSON}
            className="w-full py-2.5 rounded-xl bg-[#C85A32] hover:bg-[#B34E29] text-white font-medium text-xs sm:text-sm flex items-center justify-center gap-2 shadow-sm transition-all"
          >
            <Download className="w-4 h-4" />
            <span>Download Full JSON Backup</span>
          </button>
        </div>
      </div>

      {/* Restore Section */}
      <div className="rounded-2xl bg-white border border-[#E8E2D5] p-6 shadow-sm space-y-4">
        <div className="flex items-center gap-3 pb-3 border-b border-[#E8E2D5]">
          <div className="p-2.5 rounded-xl bg-[#FAF7F2] text-[#554E45] border border-[#E8E2D5]">
            <Upload className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-serif text-lg text-[#221F1D]">Restore Data from Backup File</h3>
            <span className="text-xs text-[#7A7265]">Import a previously exported MessMate JSON backup</span>
          </div>
        </div>

        <p className="text-xs text-[#7A7265] leading-relaxed max-w-2xl">
          Restoring merges existing records and preserves historical entries without duplication. Make sure you select a valid JSON backup exported from MessMate.
        </p>

        <div className="pt-2">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept=".json,application/json"
            className="hidden"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            className="px-5 py-2.5 rounded-xl bg-[#FAF7F2] hover:bg-[#F2ECE1] text-[#221F1D] border border-[#E8E2D5] font-medium text-xs sm:text-sm flex items-center gap-2 transition-all shadow-sm"
          >
            <Upload className="w-4 h-4 text-[#C85A32]" />
            <span>Select JSON Backup File to Restore</span>
          </button>
        </div>

        {/* Import status notification */}
        {importStatus && (
          <div
            className={`p-4 rounded-xl border flex items-start gap-3 text-xs ${
              importStatus.success
                ? 'bg-[#E8F3EE] border-[#B7DFCD] text-[#2D6A4F]'
                : 'bg-[#FDF0EC] border-[#F2C5B8] text-[#C85A32]'
            }`}
          >
            {importStatus.success ? (
              <CheckCircle2 className="w-4 h-4 text-[#2D6A4F] shrink-0 mt-0.5" />
            ) : (
              <AlertTriangle className="w-4 h-4 text-[#C85A32] shrink-0 mt-0.5" />
            )}
            <span>{importStatus.message}</span>
          </div>
        )}
      </div>
    </div>
  );
};
