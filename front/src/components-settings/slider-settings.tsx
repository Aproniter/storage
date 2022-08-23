import { ReactElement } from "react"

export const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    swipeToSlide: true,
    slidesToScroll: 1,
    appendDots: (dots: ReactElement) => (
        <div
          style={{
            backgroundColor: '#e9e6e2',
            borderRadius: '2px',
            padding: '10px',
            position: 'relative',
          }}
        >
          <ul style={{margin:'0px'}}> {dots} </ul>
        </div>
        ),
      customPaging: (i: number) => (
        <div
          style={{
            width: '30px',
            // color: 'blue',
            border: "1px blue solid"
          }}
        >
          {i + 1}
        </div>
      )
};