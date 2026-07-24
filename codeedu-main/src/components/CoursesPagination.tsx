import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination"

type PaginationProps = {
    current_page: number
    last_page: number
    total: number
    per_page?: number
    setPage: (page: number) => void
}

export function CoursesPagination({ 
    current_page = 1, 
    last_page = 1, 
    total = 0, 
    per_page = 32,
    setPage 
}: PaginationProps) {
   
    if (!current_page || !last_page || last_page <= 1 || total <= per_page) {
        return null
    }

   
    const getPageNumbers = () => {
        const pages: (number | string)[] = []
        const delta = 2 
        const totalPages = Math.ceil(total / per_page)

     
        pages.push(1)

     
        const start = Math.max(2, current_page - delta)
        const end = Math.min(totalPages - 1, current_page + delta)

       
        if (start > 2) {
            pages.push("ellipsis")
        }

       
        for (let i = start; i <= end; i++) {
            pages.push(i)
        }


        if (end < totalPages - 1) {
            pages.push("ellipsis")
        }


        if (totalPages > 1) {
            pages.push(totalPages)
        }

        return pages
    }

    const canGoPrevious = current_page > 1
    const canGoNext = current_page < last_page

    return (
        <div className="py-8 flex justify-end">
            <Pagination className="justify-end">
                <PaginationContent>

                    <PaginationItem>
                        <PaginationPrevious
                            href="#"
                            className={!canGoPrevious ? "pointer-events-none opacity-50" : ""}
                            aria-disabled={!canGoPrevious}
                            onClick={(e) => {
                                e.preventDefault()
                                if (canGoPrevious) setPage(current_page - 1)
                            }}
                        />
                    </PaginationItem>


                    {getPageNumbers().map((page, idx) =>
                        page === "ellipsis" ? (
                            <PaginationItem key={`ellipsis-${idx}`}>
                                <PaginationEllipsis />
                            </PaginationItem>
                        ) : (
                            <PaginationItem key={`page-${page}`}>
                                <PaginationLink
                                    href="#"
                                    isActive={page === current_page}
                                    className={page === current_page ? "bg-primary text-white" : ""}
                                    onClick={(e) => {
                                        e.preventDefault()
                                        setPage(page as number)
                                    }}
                                >
                                    {page}
                                </PaginationLink>
                            </PaginationItem>
                        )
                    )}


                    <PaginationItem>
                        <PaginationNext
                            href="#"
                            className={!canGoNext ? "pointer-events-none opacity-50" : ""}
                            aria-disabled={!canGoNext}
                            onClick={(e) => {
                                e.preventDefault()
                                if (canGoNext) setPage(current_page + 1)
                            }}
                        />
                    </PaginationItem>
                </PaginationContent>
            </Pagination>
        </div>
    )
}
