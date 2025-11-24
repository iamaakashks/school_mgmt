'use client';

import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

type ReportCardData = {
  student: {
    name: string;
    admissionNo: string;
    class: string;
    section: string;
    dob: Date;
  };
  exam: {
    name: string;
    term: string | null;
    className: string;
    startDate: Date;
    endDate: Date;
  };
  results: {
    subjectName: string;
    subjectCode: string;
    maxMarks: number;
    marks: number | null;
    grade: string | null;
  }[];
  summary: {
    totalMarks: number;
    totalMaxMarks: number;
    percentage: number;
  };
};

export function ReportCard({ data }: { data: ReportCardData }) {
  const handlePrint = () => {
    window.print();
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const getGrade = (percentage: number) => {
    if (percentage >= 90) return 'A+';
    if (percentage >= 80) return 'A';
    if (percentage >= 70) return 'B+';
    if (percentage >= 60) return 'B';
    if (percentage >= 50) return 'C';
    if (percentage >= 40) return 'D';
    return 'F';
  };

  const getGradeColor = (percentage: number) => {
    if (percentage >= 80) return 'text-green-600 dark:text-green-400';
    if (percentage >= 60) return 'text-blue-600 dark:text-blue-400';
    if (percentage >= 40) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-red-600 dark:text-red-400';
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      {/* Print Button - Hidden when printing */}
      <div className="mb-6 flex justify-end print:hidden">
        <Button onClick={handlePrint} className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700">
          <svg className="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
          </svg>
          Print Report Card
        </Button>
      </div>

      {/* Report Card - Optimized for printing */}
      <div className="bg-white text-black rounded-lg shadow-lg p-8 print:shadow-none print:p-6">
        {/* Header */}
        <div className="text-center border-b-2 border-gray-800 pb-6 mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Springfield Academy</h1>
          <p className="text-sm text-gray-600 mt-2">Excellence in Education</p>
          <h2 className="text-xl font-semibold text-gray-800 mt-4">
            Student Report Card
          </h2>
        </div>

        {/* Student & Exam Information */}
        <div className="grid grid-cols-2 gap-8 mb-8">
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4 border-b border-gray-300 pb-2">
              Student Information
            </h3>
            <div className="space-y-2 text-sm">
              <div className="flex">
                <span className="font-medium text-gray-700 w-32">Name:</span>
                <span className="text-gray-900">{data.student.name}</span>
              </div>
              <div className="flex">
                <span className="font-medium text-gray-700 w-32">Admission No:</span>
                <span className="text-gray-900">{data.student.admissionNo}</span>
              </div>
              <div className="flex">
                <span className="font-medium text-gray-700 w-32">Class:</span>
                <span className="text-gray-900">{data.student.class}</span>
              </div>
              <div className="flex">
                <span className="font-medium text-gray-700 w-32">Section:</span>
                <span className="text-gray-900">{data.student.section}</span>
              </div>
              <div className="flex">
                <span className="font-medium text-gray-700 w-32">Date of Birth:</span>
                <span className="text-gray-900">{formatDate(data.student.dob)}</span>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4 border-b border-gray-300 pb-2">
              Exam Information
            </h3>
            <div className="space-y-2 text-sm">
              <div className="flex">
                <span className="font-medium text-gray-700 w-32">Exam:</span>
                <span className="text-gray-900">{data.exam.name}</span>
              </div>
              {data.exam.term && (
                <div className="flex">
                  <span className="font-medium text-gray-700 w-32">Term:</span>
                  <span className="text-gray-900">{data.exam.term}</span>
                </div>
              )}
              <div className="flex">
                <span className="font-medium text-gray-700 w-32">Class:</span>
                <span className="text-gray-900">{data.exam.className}</span>
              </div>
              <div className="flex">
                <span className="font-medium text-gray-700 w-32">Date:</span>
                <span className="text-gray-900">
                  {formatDate(data.exam.startDate)} - {formatDate(data.exam.endDate)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Results Table */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 border-b border-gray-300 pb-2">
            Subject-wise Performance
          </h3>
          <table className="w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-gray-300 px-4 py-3 text-left text-sm font-semibold text-gray-800">
                  Subject
                </th>
                <th className="border border-gray-300 px-4 py-3 text-left text-sm font-semibold text-gray-800">
                  Code
                </th>
                <th className="border border-gray-300 px-4 py-3 text-center text-sm font-semibold text-gray-800">
                  Max Marks
                </th>
                <th className="border border-gray-300 px-4 py-3 text-center text-sm font-semibold text-gray-800">
                  Marks Obtained
                </th>
                <th className="border border-gray-300 px-4 py-3 text-center text-sm font-semibold text-gray-800">
                  Percentage
                </th>
                <th className="border border-gray-300 px-4 py-3 text-center text-sm font-semibold text-gray-800">
                  Grade
                </th>
              </tr>
            </thead>
            <tbody>
              {data.results.map((result, index) => {
                const subjectPercentage =
                  result.marks !== null ? (result.marks / result.maxMarks) * 100 : 0;
                return (
                  <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    <td className="border border-gray-300 px-4 py-3 text-sm text-gray-900">
                      {result.subjectName}
                    </td>
                    <td className="border border-gray-300 px-4 py-3 text-sm text-gray-700">
                      {result.subjectCode}
                    </td>
                    <td className="border border-gray-300 px-4 py-3 text-center text-sm text-gray-900">
                      {result.maxMarks}
                    </td>
                    <td className="border border-gray-300 px-4 py-3 text-center text-sm font-semibold text-gray-900">
                      {result.marks !== null ? result.marks.toFixed(1) : '-'}
                    </td>
                    <td className="border border-gray-300 px-4 py-3 text-center text-sm text-gray-900">
                      {result.marks !== null ? `${subjectPercentage.toFixed(2)}%` : '-'}
                    </td>
                    <td className="border border-gray-300 px-4 py-3 text-center text-sm font-semibold text-gray-900">
                      {result.grade || (result.marks !== null ? getGrade(subjectPercentage) : '-')}
                    </td>
                  </tr>
                );
              })}
              {/* Total Row */}
              <tr className="bg-gray-200 font-semibold">
                <td colSpan={2} className="border border-gray-300 px-4 py-3 text-sm text-gray-900">
                  TOTAL
                </td>
                <td className="border border-gray-300 px-4 py-3 text-center text-sm text-gray-900">
                  {data.summary.totalMaxMarks}
                </td>
                <td className="border border-gray-300 px-4 py-3 text-center text-sm text-gray-900">
                  {data.summary.totalMarks.toFixed(1)}
                </td>
                <td className="border border-gray-300 px-4 py-3 text-center text-sm text-gray-900">
                  {data.summary.percentage.toFixed(2)}%
                </td>
                <td className="border border-gray-300 px-4 py-3 text-center text-sm text-gray-900">
                  {getGrade(data.summary.percentage)}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Summary Section */}
        <div className="mb-8 grid grid-cols-3 gap-6">
          <div className="text-center p-4 bg-gray-100 rounded-lg">
            <p className="text-sm text-gray-600 mb-1">Total Marks</p>
            <p className="text-2xl font-bold text-gray-900">
              {data.summary.totalMarks.toFixed(1)} / {data.summary.totalMaxMarks}
            </p>
          </div>
          <div className="text-center p-4 bg-gray-100 rounded-lg">
            <p className="text-sm text-gray-600 mb-1">Percentage</p>
            <p className="text-2xl font-bold text-gray-900">
              {data.summary.percentage.toFixed(2)}%
            </p>
          </div>
          <div className="text-center p-4 bg-gray-100 rounded-lg">
            <p className="text-sm text-gray-600 mb-1">Overall Grade</p>
            <p className="text-2xl font-bold text-gray-900">
              {getGrade(data.summary.percentage)}
            </p>
          </div>
        </div>

        {/* Grading Scale */}
        <div className="mb-8">
          <h3 className="text-sm font-semibold text-gray-800 mb-3">Grading Scale</h3>
          <div className="grid grid-cols-7 gap-2 text-xs">
            <div className="text-center p-2 bg-gray-100 rounded">
              <p className="font-semibold text-gray-900">A+</p>
              <p className="text-gray-600">90-100%</p>
            </div>
            <div className="text-center p-2 bg-gray-100 rounded">
              <p className="font-semibold text-gray-900">A</p>
              <p className="text-gray-600">80-89%</p>
            </div>
            <div className="text-center p-2 bg-gray-100 rounded">
              <p className="font-semibold text-gray-900">B+</p>
              <p className="text-gray-600">70-79%</p>
            </div>
            <div className="text-center p-2 bg-gray-100 rounded">
              <p className="font-semibold text-gray-900">B</p>
              <p className="text-gray-600">60-69%</p>
            </div>
            <div className="text-center p-2 bg-gray-100 rounded">
              <p className="font-semibold text-gray-900">C</p>
              <p className="text-gray-600">50-59%</p>
            </div>
            <div className="text-center p-2 bg-gray-100 rounded">
              <p className="font-semibold text-gray-900">D</p>
              <p className="text-gray-600">40-49%</p>
            </div>
            <div className="text-center p-2 bg-gray-100 rounded">
              <p className="font-semibold text-gray-900">F</p>
              <p className="text-gray-600">&lt;40%</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-12 pt-6 border-t border-gray-300">
          <div className="grid grid-cols-2 gap-8">
            <div>
              <div className="border-t-2 border-gray-400 w-48 mt-8"></div>
              <p className="text-sm text-gray-700 mt-2">Class Teacher Signature</p>
            </div>
            <div className="text-right">
              <div className="border-t-2 border-gray-400 w-48 mt-8 ml-auto"></div>
              <p className="text-sm text-gray-700 mt-2">Principal Signature</p>
            </div>
          </div>
          <div className="text-center mt-8 text-xs text-gray-500">
            <p>This is a computer-generated report card</p>
            <p className="mt-1">Generated on {new Date().toLocaleDateString()}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
