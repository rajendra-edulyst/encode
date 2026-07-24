import { studentDetails2 } from "@/data/studentlist";

export default function MemberCard() {
    // Student data
    const student = studentDetails2;

    return (
        <div className="w-full max-w-[550px] bg-[#2a2a2a] rounded-xl p-6 text-white">

            {/* PART 1: Student Info */}
            <div className="flex items-center gap-4 mb-6">
                <img
                    src={student.avatar}
                    alt={student.name}
                    className="w-16 h-16 rounded-full object-cover"
                />
                <div>
                    <h3 className="text-lg font-semibold">{student.name}</h3>
                    <p className="text-sm text-gray-400">{student.email}</p>
                    <p className="text-sm text-gray-400">Enrolled: {student.dueDate}</p>
                </div>
            </div>

            {/* PART 2: Three Stat Boxes */}
            <div className="grid grid-cols-3 gap-4 mb-6">
                {/* Progress Box */}
                <div className="border border-gray-600 text-center p-4 rounded-md">
                    <p className="text-2xl font-bold">{student.progress}%</p>
                    <p className="text-sm text-gray-400 mt-1">Progress</p>
                </div>

                {/* Hours Box */}
                <div className="border border-gray-600 text-center p-4 rounded-md">
                    <p className="text-2xl font-bold">{student.totalHours}</p>
                    <p className="text-sm text-gray-400 mt-1">Total Hours</p>
                </div>

                {/* Attendance Box */}
                <div className="border border-gray-600 text-center p-4 rounded-md">
                    <p className="text-2xl font-bold">{student.attendance}%</p>
                    <p className="text-sm text-gray-400 mt-1">Attendance</p>
                </div>
            </div>

            {/* PART 3: Module Progress */}
            <div className="mb-6">
                <h3 className="text-lg font-semibold mb-4">Module Progress</h3>
                <div className="flex flex-col gap-4">
                    {student.modules.map((module, index) => (
                        <div
                            key={index}
                            className="bg-gray-700 p-4 rounded-md"
                        >
                            <p className="text-sm mb-2">{module.name}</p>
                            <div className="flex justify-between mb-2">
                                <p className="text-sm text-green-400">Grade: {module.grade}</p>
                                <p className="text-sm">{module.progress}%</p>
                            </div>
                            <div className="w-full h-2 bg-gray-500 rounded-full overflow-hidden">
                                <div
                                    style={{ width: `${module.progress}%` }}
                                    className="h-2 bg-green-400 rounded-full transition-all"
                                ></div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* PART 4: Assessments and Assignments */}
            <div className="grid grid-cols-2 gap-4 mb-6">
                {/* Assessments */}
                <div className="bg-gray-700 p-4 rounded-md">
                    <div className="flex items-center gap-2 mb-3">
                        <span className="text-blue-400">📋</span>
                        <h4 className="font-semibold">Assessments</h4>
                    </div>
                    <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                            <span className="text-gray-300">Completed</span>
                            <span>{student.assessments.completed}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-gray-300">Pending</span>
                            <span>{student.assessments.pending}</span>
                        </div>
                    </div>
                </div>

                {/* Assignments */}
                <div className="bg-gray-700 p-4 rounded-md">
                    <div className="flex items-center gap-2 mb-3">
                        <span className="text-purple-400">📝</span>
                        <h4 className="font-semibold">Assignments</h4>
                    </div>
                    <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                            <span className="text-gray-300">Completed</span>
                            <span>{student.assignments.completed}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-gray-300">Pending</span>
                            <span>{student.assignments.pending}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* PART 5: Achievements */}
            <div className="mb-6">
                <div className="bg-gray-700 p-4 rounded-md">
                    <h4 className="text-lg font-semibold mb-4">Achievements</h4>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="text-center">
                            <p className="text-3xl font-bold">{student.achievements.certificates}</p>
                            <p className="text-sm text-gray-300 mt-1">Certificates</p>
                        </div>
                        <div className="text-center">
                            <p className="text-3xl font-bold">{student.achievements.badges}</p>
                            <p className="text-sm text-gray-300 mt-1">Badges</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* PART 6: Recent Activity */}
            <div>
                <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
                <div className="space-y-3">
                    {student.recentActivity.map((activity, index) => (
                        <div
                            key={index}
                            className="flex items-center gap-4 bg-gray-700 p-3 rounded-lg"
                        >
                            <div className={`flex items-center justify-center w-10 h-10 rounded-md ${activity.bgColor}`}>
                                {activity.icon}
                            </div>
                            <div className="flex-1">
                                <p className="font-medium">{activity.title}</p>
                                <p className="text-sm text-gray-300">
                                    {activity.time} <span className="text-green-400 ml-2">{activity.status}</span>
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}