import imgLogo from '../img/logo_polymedia.png';

export const AboutButton: React.FC<{
    openModal: (content: React.ReactNode) => void;
}> = ({
    openModal,
}) =>
{
    return (
        <div
            id='about-btn'
            className='big-btn'
            onClick={() => openModal(<AboutMenu />)}
        >
            <img id='about-logo' src={imgLogo} alt='Polymedia Profile' />
        </div>
    );
}

export const AboutMenu: React.FC<{
}> = ({
}) => {

    return (
        <div id='about-menu'>
            <h2>About</h2>
            <p>Polymedia Timezones is <a href='https://github.com/juzybits/polymedia-timezones' target='_blank' rel='noopener'>open-source</a></p>
            <p>See my other work at <a href='https://polymedia.app' target='_blank' rel='noopener'>polymedia.app</a></p>
            <p>Send your feedback/bugs/requests:
                <br/><a href='https://twitter.com/juzybits' target='_blank' rel='noopener'>@juzybits</a>
                <br/><a href='https://twitter.com/polymedia_app' target='_blank' rel='noopener'>@polymedia_app</a>
                <br/><a href='https://discord.gg/3ZaE69Eq78' target='_blank' rel='noopener'>Polymedia Discord</a></p>

            <br/>
            <hr/>
            <div id='about-keyboard'>
                <h2>Keyboard shortcuts</h2>
                <p><span>+</span>open city menu</p>
                <p><span>Up/Down</span>navigate city menu</p>
                <p><span>Enter</span>add city to dashboard</p>
                <p><span>Escape</span>close city menu</p>
            </div>

        </div>
    );
}
