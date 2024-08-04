import React from 'react';
import './Home.css';
import mindspark from './Capture.png';
import c from './c.png';
import py from './python.png';
import cpp from './cpp.png';
import ja from './java.png';
import inte from './intellect.png';

import Footer from './footer/footer';

function Home() {
    return (
        <div>
            <div className='full-screen'>
            <div className='row'>
                <div  className='mindimg'>
                <img className='mlogo' src={mindspark} height={300} width={300} />
                </div>
            <div className='h1tit'>
                <h1 className='h1head animate'>IntellecT</h1>
                <h2 className='h2dept'>DEPARTMENT OF INFORMATION TECHNOLOGY</h2>
                <h3 className='h3dept'>TECHNO MAIN SALT LAKE</h3>
            </div>
            <div  className='inteimg'>
                <img className='mlogo inlogo' src={inte} height={300} width={300} />
            </div>
            </div>
            <section class="hexagon-gallery">
                <div class="hex"><img src={c} /></div>
                <div class="hex hex1"><img className='py' src={py} height={200} width={200}/></div>
                <div class="hex"><img src={cpp} /></div>
                <div class="hex hex1"><img className='jav' src={ja} height={200} width={100} /></div>
            </section>
            </div>
            <Footer/>
        </div>
    );
}

export default Home;