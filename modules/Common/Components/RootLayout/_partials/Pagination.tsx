import { Dispatch, SetStateAction } from "react";
import {
  Pagination as PaginationNav,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

export interface PaginationProps {
  totalPages: number;
  totalPagesToDisplay?: number;
  currentPage: number;
  setCurrentPage: Dispatch<SetStateAction<number>>;
}

const Pagination: React.FC<PaginationProps> = ({
  totalPages,
  totalPagesToDisplay = 5,
  currentPage,
  setCurrentPage,
}: PaginationProps) => {
  const showLeftEllipsis =
    totalPages > totalPagesToDisplay &&
    currentPage > Math.floor(totalPagesToDisplay / 2) + 1;
  const showRightEllipsis =
    totalPages > totalPagesToDisplay &&
    currentPage < totalPages - Math.floor(totalPagesToDisplay / 2);
  const getPageNumbers = () => {
    if (totalPages <= totalPagesToDisplay) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    } else {
      const half = Math.floor(totalPagesToDisplay / 2);
      let start = currentPage - half;
      let end = currentPage + half;
      if (start < 1) {
        start = 1;
        end = totalPagesToDisplay;
      }

      if (end > totalPages) {
        start = totalPages - totalPagesToDisplay + 1;
        end = totalPages;
      }
      if (showLeftEllipsis) {
        start++;
      }
      if (showRightEllipsis) {
        end--;
      }
      return Array.from({ length: end - start + 1 }, (_, i) => start + i);
    }
  };

  const renderPaginationItems = () => {
    const pageNumbers = getPageNumbers();
    return pageNumbers.map((pageNumber) => (
      <PaginationItem key={pageNumber}>
        <PaginationLink
          href="#"
          isActive={pageNumber === currentPage}
          onClick={() => setCurrentPage(pageNumber)}
        >
          {pageNumber}
        </PaginationLink>
      </PaginationItem>
    ));
  };

  return (
    <>
      {totalPages != 1 && (
        <PaginationNav>
          <PaginationContent>
            {currentPage != 1 && (
              <PaginationItem>
                <PaginationPrevious
                  href="#"
                  onClick={() =>
                    currentPage > 1 && setCurrentPage(currentPage - 1)
                  }
                  aria-disabled={currentPage === 1}
                />
              </PaginationItem>
            )}
            {showLeftEllipsis && (
              <PaginationItem>
                <PaginationEllipsis />
              </PaginationItem>
            )}
            {renderPaginationItems()}
            {showRightEllipsis && (
              <PaginationItem>
                <PaginationEllipsis />
              </PaginationItem>
            )}
            {currentPage != totalPages && (
              <PaginationItem>
                <PaginationNext
                  href="#"
                  onClick={() =>
                    currentPage < totalPages && setCurrentPage(currentPage + 1)
                  }
                  aria-disabled={currentPage === totalPages}
                />
              </PaginationItem>
            )}
          </PaginationContent>
        </PaginationNav>
      )}
    </>
  );
};

export default Pagination;
