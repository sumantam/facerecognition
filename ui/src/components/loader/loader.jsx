import './loader.css'
export default function Loader() {
    return (
        <div className='loading'>
            <div className='logo'></div>
            <div className='dots animate'>
                <div className='dot'></div>
                <div className='dot'></div>
                <div className='dot'></div>
                <div className='dot'></div>
                <div className='dot'></div>
            </div>
        </div>
    )
}