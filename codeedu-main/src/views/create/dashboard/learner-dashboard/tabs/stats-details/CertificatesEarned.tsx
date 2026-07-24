import React, { useState } from "react";
import Breadcrumb from "@/components/breadcrumb";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/ShadcnInput";
import { Search, Loader2, Download, Eye } from "lucide-react";
import { cn } from "@/lib/utils";
import { useSearchParams } from "react-router-dom";
import { useEarnedCertificates } from "@/hooks/data/create/useCourses";
import dayjs from "dayjs";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const breadcrumbItems = [
  { label: "Overview", path: "/dashboard/learner" },
  { label: "Certificates" },
];

const CertificateList = () => {
  const [searchParams] = useSearchParams();
  const timeFilter = searchParams.get("timeFilter") || "yearly";
  const { data: certificates, isLoading } = useEarnedCertificates(timeFilter);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredCertificates = (certificates || []).filter((cert) =>
    cert?.certificate_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    cert?.issuing_organization?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Top bar */}
      <div className="flex items-center justify-between">
        <Breadcrumb items={breadcrumbItems} />

        <div className="relative w-[260px]">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search Certificate"
            className="pl-9 bg-[#1f1f1f] border-[#2a2a2a] text-sm"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Table */}
      <Card className="bg-[#1c1c1c] border-[#2a2a2a] rounded-xl overflow-hidden">
        <Table>
          {/* Header */}
          <TableHeader className="bg-[#2a2a2a]">
            <TableRow>
              <TableHead className="w-[60px]">S.no</TableHead>

              <TableHead className="min-w-[220px]">
                Certificate Name
              </TableHead>

              <TableHead className="min-w-[200px]">
                Issuing Organization
              </TableHead>

              <TableHead className="w-[100px] text-center">
                Grade
              </TableHead>

              <TableHead className="w-[140px] whitespace-nowrap">
                Issued On
              </TableHead>

              <TableHead className="w-[120px] text-center">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>

          {/* Body */}
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={6} className="h-32 text-center">
                  <div className="flex justify-center items-center">
                    <Loader2 className="h-6 w-6 animate-spin text-codeblue" />
                    <span className="ml-2 text-gray-400">Loading certificates...</span>
                  </div>
                </TableCell>
              </TableRow>
            ) : filteredCertificates.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-32 text-center text-gray-400">
                  No certificates found.
                </TableCell>
              </TableRow>
            ) : (
              filteredCertificates.map((item, index) => (
                <TableRow
                  key={index}
                  className="border-b border-[#2f2f2f]"
                >
                  {/* S.no */}
                  <TableCell>{index + 1}</TableCell>

                  {/* Certificate Name */}
                  <TableCell className="font-medium leading-relaxed">
                    {item.certificate_name}
                  </TableCell>

                  {/* Issuing Organization */}
                  <TableCell>
                    {item.issuing_organization}
                  </TableCell>

                  {/* Grade */}
                  <TableCell className="text-center">
                    <span className="px-2 py-1 bg-zinc-800 rounded text-xs">
                      {item.grade}
                    </span>
                  </TableCell>

                  {/* Issued On */}
                  <TableCell className="text-gray-400 whitespace-nowrap">
                    {dayjs(item.earned_date).format("MMM DD, YYYY")}
                  </TableCell>

                  {/* Actions */}
                  <TableCell>
                    <div className="flex items-center justify-center gap-3">
                      <a
                        href={item.download_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 hover:bg-[#2a2a2a] rounded-lg transition-colors text-gray-400 hover:text-white"
                        title="View"
                      >
                        <Eye className="h-4 w-4" />
                      </a>
                      <a
                        href={item.download_url}
                        download
                        className="p-2 hover:bg-[#2a2a2a] rounded-lg transition-colors text-gray-400 hover:text-white"
                        title="Download"
                      >
                        <Download className="h-4 w-4" />
                      </a>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
};

export default CertificateList;

