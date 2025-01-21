import Data from './data.js';
import Card from './card.jsx';


function Body() {



    return (
        <>
            <div className='body-div'>Hello</div>

            <div className="body-homepage">
                <h2>Best seller</h2>

               

                    <div className='container row'>
                    {Data.map((item) => <Card image={item.image} text={item.text} />)}
                </div> 
                <h2>Blog</h2>

                <div className='container row'>
                     {Data.map((item) => <Card image={item.image} text={item.text} />)}
                 </div>
            </div>
        </>
    );
}

export default Body
