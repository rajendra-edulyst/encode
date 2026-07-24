import { useState } from 'react';
import { Star, Download } from 'lucide-react';

export default function GradeAssignment() {
  const [feedback, setFeedback] = useState('');

  const student = {
    name: 'Sarah Johnson',
    email: 'sarahjohnson@gmail.com',
    status: 'Pending Review',
    submittedDate: 'Dec 24, 2024, 11:30 PM',
    files: [
      { name: 'component-library.fig', icon: '📄' },
      { name: 'documentation.pdf', icon: '📄' }
    ]
  };

  const review_status = 1;

  const handleSubmit = () => {
    alert('Grade submitted!');
  };

  return (
    <div className="w-full max-w-md bg-[#2a2a2a] rounded-xl p-6 text-white">
      {/* Header */}
      <div className="flex justify-between items-start mb-6">
        <h1 className="text-xl font-semibold">Grade Assignment</h1>
        <button
          onClick={handleSubmit}
          disabled={review_status === 1}
          className={`flex items-center gap-2 px-6 py-3 transition-colors rounded-lg border-2 ${
            review_status === 1
              ? 'bg-transparent border-[#7cb342]/50 text-[#7cb342] cursor-not-allowed'
              : 'bg-[#7cb342] hover:bg-[#8bc34a] text-white border-transparent'
          }`}
        >
          <Star className="w-5 h-5" />
          <span className="font-medium">
            {review_status === 1 ? 'Reviewed' : 'Submit Grade'}
          </span>
        </button>
      </div>

      {/* Student Info */}
      <div className="flex items-center gap-4 mb-6">
        <img
          src="https://ui-avatars.com/api/?name=Sarah+Johnson&background=7cb342&color=fff&size=48"
          alt="Student"
          className="w-12 h-12 rounded-full"
        />
        <div>
          <h2 className="font-semibold text-base">{student.name}</h2>
          <p className="text-gray-400 text-sm">{student.email}</p>
        </div>
      </div>

      {/* Submission Status */}
      <div className="mb-6">
        <h3 className="text-sm text-gray-400 mb-2">Submission Status</h3>
        <div className="flex items-center gap-2">
          <span className="bg-[#ffc107] text-black px-3 py-1 rounded text-sm font-medium">
            {student.status}
          </span>
          <span className="text-gray-400 text-sm">
            Submitted {student.submittedDate}
          </span>
        </div>
      </div>

      {/* Attached Files */}
      <div className="mb-6">
        <h3 className="text-sm text-gray-400 mb-3">
          Attached Files ({student.files.length})
        </h3>
        <div className="space-y-2">
          {student.files.map((file, index) => (
            <div
              key={index}
              className="bg-[#3a3a3a] hover:bg-[#424242] px-4 py-3 rounded-lg flex items-center justify-between cursor-pointer transition-colors"
            >
              <div className="flex items-center gap-3">
                <span className="text-xl">{file.icon}</span>
                <span className="text-sm">{file.name}</span>
              </div>
              <Download className="w-4 h-4 text-[#64b5f6]" />
            </div>
          ))}
        </div>
      </div>

      {/* Preview Button */}
      <button className="w-full bg-[#2196f3] hover:bg-[#42a5f5] py-3 rounded-lg flex items-center justify-center gap-2 mb-6 transition-colors">
        <span className="text-lg">👁️</span>
        <span className="font-medium">Preview All Files</span>
      </button>

      {/* Feedback Section */}
      <div>
        <h3 className="text-sm text-gray-400 mb-2">Feedback</h3>
        <textarea
          value={feedback}
          onChange={(e) => setFeedback(e.target.value)}
          placeholder="Write your detailed feedback for the student..."
          className="w-full bg-[#3a3a3a] text-white placeholder-gray-500 px-4 py-3 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-[#7cb342] transition-all"
          rows={6}
        />
        <p className="text-xs text-gray-500 mt-2">{feedback.length} characters</p>
      </div>
    </div>
  );
}