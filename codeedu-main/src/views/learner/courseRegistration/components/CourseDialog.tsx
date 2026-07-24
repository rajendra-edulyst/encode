import React from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@components/ui/dialog"

type Slot = {
    startDateTime: string
    endDateTime: string
    dayOfWeek: string
  }

type Course = {
  courseName: string
  credits: string
  hostDepartment: string
  availableSeats: number
  maximumSeats: number
  keywords: string
  description: string
  learningoutcomes: string;
  slots: Slot[]
}

type CourseDialogProps = {
  open: boolean
  onClose: () => void
  course: Course | null
}


const CourseDialog = ({ open, onClose, course }:CourseDialogProps) => {
  if (!course) return null

  const learningOutcomesList = course.learningoutcomes
  .split(/(?=\d+\.\s)/) // Split by numbering like "1. ", "2. "
  .map(item => item.trim())
  .filter(Boolean);

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle className="text-xl flex justify-between pb-2 pt-5">
                <div>{course.courseName}</div>
                <span className="bg-orange-100 text-orange-900 text-sm font-normal px-2 py-1 rounded-full">
                 {course.credits ? `${course.credits} Credits` : "N/A"}
                </span>
          </DialogTitle>
          <div className="border-t" />
        </DialogHeader>
        <div className="flex justify-between item-center">
            <div className="text-lg font-bold">{course.hostDepartment}</div>
            <div className="text-lg">Available seats: <span className="font-bold text-primary">{course.availableSeats} / {course.maximumSeats}</span></div>
        </div>
        {course.description && 
        <div className="flex flex-col gap-2">
            <div className="text-xl font-bold text-primary">About</div>
            <div
            className="text-sm text-gray-700 leading-relaxed"
            dangerouslySetInnerHTML={{ __html: course.description }}
            />
        </div>
        }
        {course?.learningoutcomes &&
        <div className="text-sm text-gray-700 space-y-2 flex flex-col gap-2">
            <div className="text-xl font-bold text-primary">Learning Outcomes</div>
            <div className="text-sm text-gray-700 leading-relaxed">
                <ol className="list-decimal list-inside space-y-2 text-sm text-gray-700">
                    {learningOutcomesList.map((point, index) => (
                    <li key={index}>{point.replace(/^\d+\.\s/, "")}</li>
                    ))}
                </ol>
            </div>
        </div>
          }
        {course?.slots.length > 0 &&
        <div className="text-sm text-gray-700 space-y-2 invisible hidden">
          <div>
            <strong>Slots:</strong>
            <ul className="list-disc ml-6 mt-1">
              {course.slots.map((slot, idx) => (
                <li key={idx}>{slot.dayOfWeek} {slot.startDateTime} - {slot.endDateTime}</li>
              ))}
            </ul>
          </div>
        </div>
        }
      </DialogContent>
    </Dialog>
  )
}

export default CourseDialog
