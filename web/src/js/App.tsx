import { Outlet } from 'react-router-dom';
import '../css/App.less';

export type AppState = {
};

export const App: React.FC = () =>
{
    const appState: AppState = {
    };

    return <>
    <div id='layout'>
        <Outlet context={appState} /> {/* #page */}
    </div>
    </>;
}
