import { IconQuestion } from "./lib/icons";

export const HelpButton = ({
    openModal,
}: {
    openModal: (content: React.ReactNode) => void;
}) =>
{
    return (
        <div
            id="help-btn"
            className="big-btn"
            onClick={() => openModal(<HelpMenu />)}
        >
            <IconQuestion />
        </div>
    );
};

export const HelpMenu = () => (
    <div id="help-menu">
        <section className="help-section">
            <h2>How to use</h2>
            <table className="help-table">
                <tbody>
                    <tr>
                        <td className="action-key">+</td>
                        <td>add a new city</td>
                    </tr>
                    <tr>
                        <td className="action-key">click city</td>
                        <td>remove from dashboard</td>
                    </tr>
                    <tr>
                        <td className="action-key">scroll</td>
                        <td>preview different times</td>
                    </tr>
                </tbody>
            </table>
        </section>

        <section className="help-section">
            <h2>Links</h2>
            <div className="help-links">
                <p><a href="https://github.com/juzybits/polymedia-timezones" target="_blank" rel="noopener noreferrer">Code on GitHub</a></p>
                <p><a href="https://polymedia.app" target="_blank" rel="noopener noreferrer">More Polymedia apps</a></p>
                <p><a href="https://twitter.com/juzybits" target="_blank" rel="noopener noreferrer">Report issues on Twitter</a></p>
            </div>
        </section>
    </div>
);
