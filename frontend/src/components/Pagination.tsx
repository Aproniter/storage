import { Dispatch, SetStateAction } from 'react';
import ReactPaginate from 'react-paginate';


interface PaginationProps {
    pageCount: number
    setPage: Dispatch<SetStateAction<number>>
}

export function Pagination({pageCount, setPage}:PaginationProps){

    const handlePageClick = ({selected}: {selected: number}) => {
        setPage(selected + 1)
    }


    return(
        <ReactPaginate
            breakLabel="..."
            nextLabel=">"
            onPageChange={handlePageClick}
            pageRangeDisplayed={3}
            pageCount={pageCount}
            previousLabel="<"
            containerClassName="pagination"
            pageClassName="page-pagination"
            activeClassName="active-page-pagination"
            previousClassName="previos-page-pagination"
            nextClassName="next-page-pagination"
        />
    )
}
