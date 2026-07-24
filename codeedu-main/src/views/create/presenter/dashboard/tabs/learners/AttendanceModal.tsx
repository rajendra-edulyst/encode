import { X, UserPlus, Download } from "lucide-react";
import { useState } from "react";

interface Student {
  id: string;
  name: string;
  email: string;
  status: "present" | "absent";
}

interface AttendanceModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AttendanceModal = ({ isOpen, onClose }: AttendanceModalProps) => {
  const [students, setStudents] = useState<Student[]>([
    { id: "1", name: "Alex Johnson", email: "alexjohnson@xyz.com", status: "present" },
    { id: "2", name: "Alex Johnson", email: "alexjohnson@xyz.com", status: "present" },
    { id: "3", name: "Alex Johnson", email: "alexjohnson@xyz.com", status: "present" },
    { id: "4", name: "Alex Johnson", email: "alexjohnson@xyz.com", status: "present" },
  ]);

  const markAllPresent = () => {
    setStudents(students.map(student => ({ ...student, status: "present" })));
  };

  const markAllAbsent = () => {
    setStudents(students.map(student => ({ ...student, status: "absent" })));
  };

  const toggleStatus = (id: string, status: "present" | "absent") => {
    setStudents(students.map(student =>
      student.id === id ? { ...student, status } : student
    ));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <div className="bg-neutral-800 rounded-2xl w-full max-w-2xl border border-white/10">
        {/* HEADER */}
        <div className="p-6 border-b border-white/10 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-white">Attendance Report</h2>

          <div className="flex items-center gap-3">
            <button className="px-4 py-2 bg-cyan-500 hover:bg-cyan-600 text-white text-sm font-medium rounded-lg flex items-center gap-2 transition-colors">
              <Download className="h-4 w-4" />
              Export
            </button>
            <button
              onClick={markAllPresent}
              className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white text-sm font-medium rounded-lg transition-colors"
            >
              Mark All Present
            </button>
            <button
              onClick={markAllAbsent}
              className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white text-sm font-medium rounded-lg transition-colors"
            >
              Mark All Absent
            </button>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors"
            >
              <X className="h-5 w-5 text-white" />
            </button>
          </div>
        </div>

        {/* STUDENT LIST */}
        <div className="p-6 space-y-3 max-h-[500px] overflow-y-auto">
          {students.map((student) => (
            <div
              key={student.id}
              className="bg-neutral-700/50 rounded-lg p-4 flex items-center justify-between border border-white/5"
            >
              {/* LEFT SIDE - STUDENT INFO */}
              <div className="flex items-center gap-4">
                <div className="relative">
                  <img
                    src={`https://i.pravatar.cc/150?img=${student.id}`}
                    alt={student.name}
                    className="w-12 h-12 rounded-full"
                  />
                  <span className={`absolute -top-1 -left-1 px-2 py-0.5 text-xs font-medium rounded ${student.status === "present"
                    ? "bg-green-500 text-white"
                    : "bg-red-500 text-white"
                    }`}>
                    {student.status === "present" ? "Present" : "Absent"}
                  </span>
                </div>
                <div>
                  <p className="text-white font-medium">{student.name}</p>
                  <p className="text-gray-400 text-sm">{student.email}</p>
                </div>
              </div>

              {/* RIGHT SIDE - ACTION BUTTONS */}
              <div className="flex gap-3">
                <button
                  onClick={() => toggleStatus(student.id, "present")}
                  className={`px-6 py-2 rounded-lg font-medium text-sm flex items-center gap-2 transition-colors ${student.status === "present"
                    ? "bg-green-500 text-white hover:bg-green-600"
                    : "bg-transparent border-2 border-gray-600 text-white hover:border-green-500"
                    }`}
                >
                  <UserPlus className="h-4 w-4" />
                  Present
                </button>
                <button
                  onClick={() => toggleStatus(student.id, "absent")}
                  className={`px-6 py-2 rounded-lg font-medium text-sm flex items-center gap-2 transition-colors ${student.status === "absent"
                    ? "bg-red-500 text-white hover:bg-red-600"
                    : "bg-transparent border-2 border-gray-600 text-white hover:border-red-500"
                    }`}
                >
                  <UserPlus className="h-4 w-4" />
                  Absent
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AttendanceModal;