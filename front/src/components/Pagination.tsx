

export function Pagination(props:{pageNumber:number, pages:number[], setPage:any}){
    return(
        <div 
            className='pagination flex w-full p-2 items-center justify-center'
        >
            {props.pages && props.pages.map((page:number) => 
                <div
                    className="border p-2 cursor-pointer"
                    style={props.pageNumber === page ? { color: "red", fontSize: "1.5rem"} : {color: "grey"}}
                    onClick={() => props.setPage(page)}
                    key={page}
                    >
                    {page}
                </div>)
            }
        </div>
    )
}
