interface ImageProps {
    id: number
    path: string
}

const ImagesURL = process.env.REACT_APP_IMAGES_URL

export function Image({ path }: ImageProps) {
    return (
        <div className='slide'>
            <a style={{width:'100%'}} rel="noreferrer" target='_blank' href={ImagesURL + '/media/' + path}><img src={ImagesURL + '/media/' + path} alt='' height='100%'/></a>
        </div>
    )
}