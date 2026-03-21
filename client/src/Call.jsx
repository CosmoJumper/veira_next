import './Call.css';
import { useContext, useRef } from 'react';
import { LanguageContext } from './App';

function Call() {
    const { language } = useContext(LanguageContext);

    return (
        <div className='call'>
            <div className='call-first-container'>
                <h2>БЕСПЛАТНАЯ КОНСУЛЬТАЦИЯ С ЭКСПЕРТОМ</h2>
                <h2>КРУГЛОСУТОЧНО!</h2>
                <div className='call-buttons'>
                <a href={`tel:+77025328122`} className="call-call-button">Позвонить</a>
                    <button className='call-whatsapp-button' onClick={() => { window.location.href = 'https://wa.me/77025328122' }}>WhatsApp</button>
                </div>
            </div>
            <div className='call-second-container'>
                <img src='/images/call-icon.png' />
            </div>
        </div>
    );
}

export default Call;