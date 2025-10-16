import React, { useState, useEffect } from 'react';

const MenuToggle = () => {
  const [sidebarShown, setSidebarShown] = useState(false);

  useEffect(() => {
    const body = document.querySelector('body');
    const mobileMenu = document.getElementById('mobile-sidebar');

    if (sidebarShown) {
      body.classList.add('mobile-sidebar-toggle');
      mobileMenu?.classList.remove('-translate-x-full');
    } else {
      body.classList.remove('mobile-sidebar-toggle');
      mobileMenu?.classList.add('-translate-x-full');
    }
  }, [sidebarShown]);

  return (
    <button
      type="button"
      aria-pressed={sidebarShown ? 'true' : 'false'}
      id="menu-toggle"
      onClick={() => setSidebarShown(!sidebarShown)}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="1em"
        height="1em"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M4 6h16M4 12h16M4 18h16"
        />
      </svg>
      <span className="sr-only">Toggle sidebar</span>
    </button>
  );
};

export default MenuToggle;
