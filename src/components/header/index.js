import React, { useContext, useState } from 'react';
import './header.css';
import { Link, useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { userLogout } from '../../reducers/authSlice';
import { ThemeContext } from '../../App';
import { useUserInfo } from '../../contexts/UserInfoContext';
import AuthorizedView from '../authorize-view';
import { PERMISSIONS } from '../../constants';

// Icons
import { MdNightsStay, MdOutlineLogout, MdSpaceDashboard } from "react-icons/md";
import { FiSun, FiUser, FiSettings, FiBell } from "react-icons/fi";
import { IoMenu } from "react-icons/io5";
import { GoTasklist } from "react-icons/go";
import { HiOutlineCog } from "react-icons/hi";

const Header = (props) => {
    const { collapsed, setCollapsed } = props;
    const dispatch = useDispatch();
    const { userInfo } = useUserInfo();
    const { theme, setTheme } = useContext(ThemeContext);
    const [userMenuOpen, setUserMenuOpen] = useState(false);
    
    const { pathname } = useLocation();
    const title = pathname.split('/')[1]?.split('-').join(' ') || 'Dashboard';
    
    const toggleUserMenu = () => {
        setUserMenuOpen(!userMenuOpen);
    };

    const handleLogout = () => {
        dispatch(userLogout());
        setUserMenuOpen(false);
    };

    return (
        <div className={`header-component ${theme ? 'dark' : 'light'}`}>
            <div className="header-wrapper">
                {/* Left side with logo and menu toggle */}
                <div className="header-logo">
                    <div 
                        className="menu-toggle" 
                        onClick={() => setCollapsed(!collapsed)}
                    >
                        <IoMenu size={24} />
                    </div>
                    <Link to="/">
                        <div className="logo-text">CMP</div>
                    </Link>
                </div>
                
                {/* Page title */}
                <div className="page-title">{title}</div>
                
                {/* Right side controls */}
                <div className="header-controls">
                    {/* Settings icon */}
                    <Link to="/settings">
                        <div className="header-icon">
                            <HiOutlineCog />
                        </div>
                    </Link>
                    
                    {/* Notifications */}
                    <Link to="/notifications">
                        <div className="header-icon">
                            <FiBell />
                        </div>
                    </Link>
                    
                    {/* Tasks - only visible with permission */}
                    <AuthorizedView requiredPermissions={[PERMISSIONS.TASKS.VIEW]}>
                        <Link to="/tasks">
                            <div className="header-icon">
                                <GoTasklist />
                            </div>
                        </Link>
                    </AuthorizedView>
                    
                    {/* Theme toggle switch */}
                    <div className="theme-switch">
                        <label className="custom-switch">
                            <input 
                                type="checkbox" 
                                checked={theme} 
                                onChange={() => setTheme(!theme)}
                            />
                            <span className="slider">
                                {theme ? <MdNightsStay size={12} style={{position: 'absolute', top: '6px', right: '6px', color: 'white'}} /> : 
                                <FiSun size={12} style={{position: 'absolute', top: '6px', left: '6px', color: '#64748b'}} />}
                            </span>
                        </label>
                    </div>
                    
                    {/* User profile dropdown */}
                    <div className="header-user">
                        <div className="user-avatar" onClick={toggleUserMenu}>
                            {userInfo?.avatar ? (
                                <img src={userInfo.avatar} alt={userInfo?.name} />
                            ) : (
                                <FiUser size={20} />
                            )}
                            <div className="status"></div>
                        </div>
                        
                        {/* Dropdown menu */}
                        {userMenuOpen && (
                            <div className="dropdown-menu">
                                <div className="dropdown-header">
                                    <div className="user-info">
                                        <div className="user-avatar">
                                            <FiUser size={20} />
                                        </div>
                                        <div className="user-details">
                                            <h3 className="user-name">{userInfo?.name} {userInfo?.surname}</h3>
                                            <p className="user-email">{userInfo?.username}</p>
                                        </div>
                                    </div>
                                </div>
                                
                                <Link to="/my-profile" onClick={() => setUserMenuOpen(false)}>
                                    <div className="dropdown-item">
                                        <FiUser />
                                        <span>My Profile</span>
                                    </div>
                                </Link>
                                
                                <Link to="/account-settings" onClick={() => setUserMenuOpen(false)}>
                                    <div className="dropdown-item">
                                        <FiSettings />
                                        <span>Account Settings</span>
                                    </div>
                                </Link>
                                
                                <Link to="/dashboard" onClick={() => setUserMenuOpen(false)}>
                                    <div className="dropdown-item">
                                        <MdSpaceDashboard />
                                        <span>Dashboard</span>
                                    </div>
                                </Link>
                                
                                <div className="dropdown-item" onClick={handleLogout}>
                                    <MdOutlineLogout />
                                    <span>Log Out</span>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Header;