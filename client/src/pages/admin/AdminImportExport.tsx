import React, { useState } from 'react';
import api from '../../services/api';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import {
  FileSpreadsheet,
  Upload,
  Download,
  CheckCircle2,
  AlertCircle,
  FileText,
  Users,
  Calendar,
  Layers,
  ArrowRight,
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const AdminImportExport: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [importing, setImporting] = useState(false);
  const [importResult, setImportResult] = useState<any>(null);
  const [errorMessage, setErrorMessage] = useState('');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selected = e.target.files[0];
      if (!selected.name.endsWith('.csv')) {
        setErrorMessage('Please select a valid .CSV spreadsheet file.');
        setFile(null);
        return;
      }
      setErrorMessage('');
      setFile(selected);
      setImportResult(null);
    }
  };

  const handleUploadCSV = async () => {
    if (!file) return;

    setImporting(true);
    setErrorMessage('');
    setImportResult(null);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await api.post('/admin/alumni/import-csv', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      setImportResult(res.data);
      confetti({ particleCount: 70, spread: 60, origin: { y: 0.6 } });
    } catch (error: any) {
      setErrorMessage(error.response?.data?.message || 'Failed to process CSV file.');
    } finally {
      setImporting(false);
    }
  };

  const sampleCsvContent = `FullName,Email,GraduationYear,Department,Degree,CurrentCompany,CurrentDesignation,City,Country,Phone
K. Suresh Babu,suresh.babu@sample.com,1998,Physics,B.Sc Physics,ISRO,Senior Scientist,Bengaluru,India,+91 9848011223
V. Lakshmi Devi,lakshmi.devi@sample.com,2005,Commerce,B.Com General,HDFC Bank,Vice President,Hyderabad,India,+91 9848099887
P. Ravi Teja,ravi.teja@sample.com,2015,Computer Science,B.Sc Computer Science,Infosys,Technical Lead,Visakhapatnam,India,+91 9848044556`;

  const downloadSampleCSV = () => {
    const blob = new Blob([sampleCsvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'GCRJY_Alumni_Import_Template.csv';
    a.click();
  };

  return (
    <div className="space-y-8 text-left">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-display">
          Data Import & Export Center
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Bulk import alumni rosters from legacy college records, or export verified member datasets as CSV.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: CSV Import Wizard */}
        <div className="lg:col-span-7 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-card space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <h2 className="text-base font-bold text-slate-900 font-display flex items-center gap-2">
              <Upload className="w-5 h-5 text-college-navy" /> Bulk Alumni CSV Importer
            </h2>
            <button
              onClick={downloadSampleCSV}
              className="text-xs font-bold text-college-blue-600 hover:underline inline-flex items-center gap-1"
            >
              <Download className="w-3.5 h-3.5" /> Download Sample CSV Template
            </button>
          </div>

          {errorMessage && (
            <div className="p-3.5 bg-red-50 border border-red-200 rounded-2xl text-red-800 text-xs font-bold flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Upload Drop Zone */}
          <div className="border-2 border-dashed border-slate-300 rounded-3xl p-8 text-center space-y-3 bg-slate-50 hover:bg-slate-100/60 transition-colors">
            <div className="w-14 h-14 rounded-2xl bg-college-navy-50 text-college-navy flex items-center justify-center mx-auto border border-college-navy-200">
              <FileSpreadsheet className="w-7 h-7" />
            </div>

            <div>
              <p className="text-sm font-bold text-slate-800">
                {file ? file.name : 'Select or Drop CSV Spreadsheet'}
              </p>
              <p className="text-xs text-slate-500 mt-0.5">
                {file
                  ? `${(file.size / 1024).toFixed(1)} KB • Ready for processing`
                  : 'Supported formats: .CSV (Comma Separated Values)'}
              </p>
            </div>

            <div className="pt-2">
              <label className="cursor-pointer">
                <span className="px-4 py-2 bg-white text-college-navy font-bold text-xs rounded-xl border border-slate-300 shadow-sm hover:bg-slate-50 transition-colors inline-block">
                  Browse Computer
                </span>
                <input
                  type="file"
                  accept=".csv"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </label>
            </div>
          </div>

          {/* Expected Columns Note */}
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-xs space-y-1.5">
            <h4 className="font-bold text-slate-800">Standard Column Header Mapping</h4>
            <p className="text-slate-600 text-[11px] leading-relaxed">
              Auto-maps: <code className="bg-white px-1.5 py-0.5 rounded border">FullName</code>,{' '}
              <code className="bg-white px-1.5 py-0.5 rounded border">Email</code>,{' '}
              <code className="bg-white px-1.5 py-0.5 rounded border">GraduationYear</code>,{' '}
              <code className="bg-white px-1.5 py-0.5 rounded border">Department</code>,{' '}
              <code className="bg-white px-1.5 py-0.5 rounded border">Degree</code>,{' '}
              <code className="bg-white px-1.5 py-0.5 rounded border">CurrentCompany</code>,{' '}
              <code className="bg-white px-1.5 py-0.5 rounded border">CurrentDesignation</code>,{' '}
              <code className="bg-white px-1.5 py-0.5 rounded border">City</code>.
            </p>
          </div>

          <Button
            variant="primary"
            size="lg"
            onClick={handleUploadCSV}
            disabled={!file || importing}
            isLoading={importing}
            rightIcon={<ArrowRight className="w-4 h-4" />}
            className="w-full font-bold shadow-md"
          >
            Confirm & Import Records into Database
          </Button>

          {/* Import Result Summary */}
          {importResult && (
            <div className="p-5 bg-emerald-50 border border-emerald-200 rounded-2xl text-xs space-y-2">
              <div className="flex items-center gap-2 text-emerald-800 font-bold text-sm">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                <span>{importResult.message}</span>
              </div>
              <p className="text-emerald-900 font-semibold">
                Imported: {importResult.importedCount} records | Skipped/Duplicate: {importResult.skippedCount}
              </p>
              {importResult.errors && importResult.errors.length > 0 && (
                <div className="mt-2 pt-2 border-t border-emerald-200 text-slate-600 text-[11px] space-y-1">
                  <span className="font-bold block text-slate-700">Notice on skipped rows:</span>
                  {importResult.errors.map((err: string, i: number) => (
                    <p key={i} className="truncate">• {err}</p>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right Column: Instant Data Exporters */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-card space-y-4">
            <h2 className="text-base font-bold text-slate-900 font-display flex items-center gap-2">
              <Download className="w-5 h-5 text-college-navy" /> Instant Dataset Exporters
            </h2>
            <p className="text-xs text-slate-500">
              Download clean CSV spreadsheets for official college audits, NIRF rankings, and NAAC reporting.
            </p>

            <div className="space-y-3 pt-2">
              {/* Alumni Directory Export */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between hover:bg-slate-100 transition-colors">
                <div>
                  <h4 className="text-xs font-bold text-slate-900">Alumni Member Directory</h4>
                  <p className="text-[11px] text-slate-500">All registered alumni, batches, companies</p>
                </div>
                <a
                  href="/api/admin/alumni/export-csv"
                  target="_blank"
                  rel="noreferrer"
                  className="px-3 py-1.5 rounded-xl bg-white border border-slate-300 hover:bg-slate-50 font-bold text-xs text-college-navy inline-flex items-center gap-1 shadow-sm"
                >
                  <Download className="w-3.5 h-3.5" /> CSV
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
