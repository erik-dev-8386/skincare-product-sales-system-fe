

export default function Card(props) {
    return (
        <>
            <div className="card col-3" >
                <img src={props.image} className="card-img-top" alt="..." />
                <div className="card-body">
                    <p className="card-text">
                        {props.text}                        
                    </p>
                </div>
                <button className="btn btn-dark">Click here</button>
            </div>
        </>
    )
}
