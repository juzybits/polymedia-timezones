import imgLogo from '../img/logo.png';

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
            <p>Polymedia Timezones is a free and open-source tool.</p>
            <p>The code is available on <a href='https://github.com/juzybits/polymedia-timezones' target='_blank' rel='noopener'>GitHub</a>.</p>
            <p>To learn more about my work, visit <a href='https://polymedia.app' target='_blank' rel='noopener'>polymedia.app</a></p>
            <p>If you have any feedback, feel free to reach out:
                <br/><a href='https://twitter.com/juzybits' target='_blank' rel='noopener'>@juzybits</a>
                <br/><a href='https://twitter.com/polymedia_app' target='_blank' rel='noopener'>@polymedia_app</a>
                <br/><a href='https://discord.gg/3ZaE69Eq78' target='_blank' rel='noopener'>Polymedia Discord</a></p>
        </div>
    );
}
