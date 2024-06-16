import { Outlet } from "react-router-dom";
import { Link } from "react-router-dom";
import './Layout.css'; // Import your CSS file
import { useLocation } from "react-router-dom";

export default function Layout() {

    const path = useLocation().pathname;

    return (
        <>
            <nav className="navbar">
                <div style={{ width: 400, display: 'flex', justifyContent: 'space-around' }}>
                    <Link to='' className={`nav-link ${path === '/' ? 'active' : ''}`}>Winrate</Link>
                    <Link to='/atlas_search' className={`nav-link ${path === '/atlas_search' ? 'active' : ''}`}>Atlas Search</Link>
                    <Link to='/chart' className={`nav-link ${path === '/chart' ? 'active' : ''}`}>Charts</Link>
                </div>
            </nav>
            <Outlet />
        </>
    )
}