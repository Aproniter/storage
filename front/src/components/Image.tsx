interface ImageProps {
    id: number
    data: string
}

const ImagesURL = process.env.REACT_APP_IMAGES_URL

export function Image({ id, data }: ImageProps) {
    return (
        <div className='slide'>
            <a style={{width:'100%'}} rel="noreferrer" target='_blank' href={ImagesURL + '/media/' + data}><img src={ImagesURL + '/media/' + data} alt='' height='100%'/></a>
        </div>
    )
}