import { IconQuestion } from "./lib/icons";

export const AboutButton = ({
    openModal,
}: {
    openModal: (content: React.ReactNode) => void;
}) =>
{
    return (
        <div
            id="about-btn"
            className="big-btn"
            onClick={() => openModal(<AboutMenu />)}
        >
            <IconQuestion />
        </div>
    );
};

export const AboutMenu = () => (
    <div id="about-menu">
        <h2>About</h2>
        <p>See code: <a href="https://github.com/juzybits/polymedia-timezones" target="_blank" rel="noopener noreferrer">github.com</a></p>
        <p>See my other projects: <a href="https://polymedia.app" target="_blank" rel="noopener noreferrer">polymedia.app</a></p>
        <p>Give me feedback: <a href="https://twitter.com/juzybits" target="_blank" rel="noopener noreferrer">@juzybits</a></p>
        <br/>
        <hr/>
        <div id="about-keyboard">
            <h2>Keyboard shortcuts</h2>
            <p><span>+</span>open city menu</p>
            <p><span>Up/Down</span>navigate city menu</p>
            <p><span>Enter</span>add city to dashboard</p>
            <p><span>Escape</span>close city menu</p>
        </div>

    </div>
);
