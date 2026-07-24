import React from 'react'
import Breadcrumb from '@/components/breadcrumb'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/ShadcnInput'
import { Search, Eye, Download } from 'lucide-react'
import { cn } from '@/lib/utils'

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

const breadcrumbItems = [

  { label: 'Overview', path: '/dashboard/learner' },
  { label: 'Avg. Session Duration' },
]

const sessions = [
  'Approved',
  'Missed',
  'Pending',
  'Approved',
  'Rejected',
  'Completed',
]

const statusStyles: Record<string, string> = {
  Approved: 'bg-sky-500 text-white',
  Missed: 'bg-red-500 text-white',
  Pending: 'bg-sky-500 text-white',
  Rejected: 'bg-red-600 text-white',
  Completed: 'bg-green-500 text-white',
}

const AvgSessionDuration = () => {
  return (
    <div className="space-y-6">
      {/* Top bar */}
      <div className="flex items-center justify-between">
        <Breadcrumb items={breadcrumbItems} />

        <div className="relative w-[260px]">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search"
            className="pl-9 bg-[#1f1f1f] border-[#2a2a2a] text-sm"
          />
        </div>
      </div>

      {/* Table */}
      <Card className="bg-[#1c1c1c] border-[#2a2a2a] rounded-xl overflow-hidden">
        <Table>
          {/* Header */}
          <TableHeader className="bg-[#2a2a2a]">
            <TableRow>
              <TableHead className="w-[60px]">S.no.</TableHead>
              <TableHead className="min-w-[180px]">
                Purpose
              </TableHead>
              <TableHead className="min-w-[220px] hidden md:table-cell">
                Session Timeline
              </TableHead>
              <TableHead className="min-w-[240px] hidden lg:table-cell">
                Mentor Name
              </TableHead>
              <TableHead className="w-[160px]">
                Session Status
              </TableHead>
              <TableHead className="w-[160px] text-right">
               Actions
              </TableHead>
            </TableRow>
          </TableHeader>

          {/* Body */}
          <TableBody>
            {sessions.map((status, index) => (
              <TableRow
                key={index}
                className="border-b border-[#2f2f2f]"
              >
                {/* S.no */}
                <TableCell>{index + 1}</TableCell>

                {/* Purpose */}
                <TableCell className="font-medium">
                  Portfolio Review
                </TableCell>

                {/* Timeline */}
                <TableCell className="hidden md:table-cell text-sm">
                  <div>Nov 07, 2025</div>
                  <div className="text-gray-400">
                    03:00 – 03:45 PM
                  </div>
                </TableCell>

                {/* Mentor */}
                <TableCell className="hidden lg:table-cell text-sm">
                  <div>Aakansha Batra</div>
                  <div className="text-gray-400">
                    aakankshabatra26@gmail.com
                  </div>
                </TableCell>

                {/* Status */}
                <TableCell>
                  <span
                    className={cn(
                      'px-3 py-1 rounded-full text-xs font-medium',
                      statusStyles[status]
                    )}
                  >
                    {status}
                  </span>
                </TableCell>

                {/* Attachment */}
                <TableCell>
                  <div className="flex justify-end items-center gap-3">
                    <Eye className="w-4 h-4 text-codeblue cursor-pointer hover:scale-110 transition" />
                    <Download className="w-4 h-4 text-codeblue cursor-pointer hover:scale-110 transition" />
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  )
}

export default AvgSessionDuration
