import React from 'react'
import { Link } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";

import './Head.css';
import Home from './icons/Home.jsx';
import Instagram from './icons/Instagram.jsx';
import Search from './icons/Search.jsx';
import Explore from './icons/Explore.jsx';
import Reels from './icons/Reels.jsx';
import Message from './icons/Message.jsx';
import Notification from './icons/Notification.jsx';
import Create from './icons/Create.jsx';
import Thread from './icons/Thread.jsx';

export default function head() {
      const { logout, authUser } = useAuthStore();

    return (
        <div className="hom">
            <div className="hed">
                <div className="in-hed">
                    <div>
                        {/* Logo */}
                        <div className="ins-hed-logo">
                            <div className="_aagx">
                                <Instagram />
                            </div>
                        </div>
                        {/* Navigation */}
                        <div className="ins-hed-nlink">
                            <ul>
                                <li className="active">
                                    <Link to="/">
                                        <span><Home /></span>
                                        <p>Home</p>
                                    </Link>
                                </li>

                                <li>
                                    <Link to="/search">
                                        <span><Search /></span>
                                        <p>Search</p>
                                    </Link>
                                </li>

                                {/* <li>
                                    <Link to="/explore">
                                        <span><Explore /></span>
                                        <p>Explore</p>
                                    </Link>
                                </li>

                                <li>
                                    <Link to="/reels">
                                        <span><Reels /></span>
                                        <p>Reels</p>
                                    </Link>
                                </li> */}

                                <li>
                                    <Link to="/messages">
                                        <span><Message /></span>
                                        {/* <div className="badge"><span>2</span></div> */}
                                        <p>Messages</p>
                                    </Link>
                                </li>

                                <li>
                                    <Link to="/notifications">
                                        <span><Notification /></span>
                                        <p>Notifications</p>
                                    </Link>
                                </li>

                                <li>
                                    <Link to="/create">
                                        <span><Create /></span>
                                        <p>Create</p>
                                    </Link>
                                </li>

                                <li>
                                    <Link to="/profile">
                                        <span>
                                            <img src={authUser.profilePic} alt="profile" />
                                        </span>
                                        <p>Profile</p>
                                    </Link>
                                </li>
                            </ul>
                        </div>
                    </div>

                    {/* Bottom Section */}
                    <div className="ins-hed-bt">
                        <ul>
                            <li>
                                <Link to="/threads">
                                    <span><Thread /></span>
                                    <p>Threads</p>
                                </Link>
                            </li>

                            <li className='text-center text-lg my-5 hover:bg-base-300 rounded-lg p-2 cursor-pointer'>
                                <div className='text-center font-semibold' onClick={logout}>
                                    {/* <LogOut className="size-5" /> */}
                                    <p className="">Logout</p>
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    )
}
