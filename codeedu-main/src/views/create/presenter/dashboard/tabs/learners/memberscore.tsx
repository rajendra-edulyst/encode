import { studentList } from "@/data/studentlist";

export default function Memberscore() {
    return (
        <div className="flex rounded-lg bg-[#1c1c1c] p-6 justify-between w-[360px]">
            {
                studentList.map((student) => (
                    <div key={student.id}>
                        <p className={`text-center ${student.color} text-3xl font-semibold`}>{student.value}</p>
                        <h3 className="text-center text-gray-400 text-sm">{student.name}</h3>
                    </div>
                ))
            }
        </div>
    )
}
