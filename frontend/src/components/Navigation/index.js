import React from 'react';
import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ProfileButton from './ProfileButton';
import './Navigation.css';

function Navigation() {
  const sessionUser = useSelector(state => state.session.user);

  return (
    <>

      <div className="home">
        <NavLink exact to="/">
          <img src="../../images/favicon-32x32.png" alt="crown" />
        </NavLink>
      </div>
      <div>
        <h1>
          HeirBnB
        </h1>
      </div>

      <div className="menu">
        <ProfileButton user={sessionUser} />
      </div>
    </>


  );
}

export default Navigation;