import React, { useState, useEffect, useRef } from 'react';
import { unescape } from 'html-escaper';

const TableOfContents = ({ headings = [] }) => {
  const toc = useRef(null);
  const onThisPageID = 'on-this-page-heading';
  const itemOffsets = useRef([]);
  const [currentID, setCurrentID] = useState('overview');

  useEffect(() => {
    const getItemOffsets = () => {
      const titles = document.querySelectorAll('article :is(h1, h2, h3, h4)');
      itemOffsets.current = Array.from(titles).map((title) => ({
        id: title.id,
        topOffset: title.getBoundingClientRect().top + window.scrollY,
      }));
    };

    getItemOffsets();
    window.addEventListener('resize', getItemOffsets);

    return () => {
      window.removeEventListener('resize', getItemOffsets);
    };
  }, []);

  useEffect(() => {
    if (!toc.current) return;

    const setCurrent = (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          const { id } = entry.target;
          if (id === onThisPageID) continue;
          setCurrentID(entry.target.id);
          break;
        }
      }
    };

    const observerOptions = {
      rootMargin: '-100px 0% -66%',
      threshold: 1,
    };

    const headingsObserver = new IntersectionObserver(
      setCurrent,
      observerOptions
    );

    document
      .querySelectorAll('article :is(h1,h2,h3)')
      .forEach((h) => headingsObserver.observe(h));

    return () => headingsObserver.disconnect();
  }, [toc.current]);

  const onLinkClick = (e) => {
    const target = e.target;
    setCurrentID(target.getAttribute('href').replace('#', ''));
  };

  return (
    <>
      <h2 id={onThisPageID} className="heading">
        Table of contents
      </h2>
      <ul ref={toc}>
        {headings
          .filter(({ depth }) => depth > 1 && depth < 4)
          .map((heading) => (
            <li
              className={`header-link depth-${heading.depth} ${
                currentID === heading.slug ? 'current-header-link' : ''
              }`.trim()}
              key={heading.slug}
            >
              <a href={`#${heading.slug}`} onClick={onLinkClick}>
                {unescape(heading.text)}
              </a>
            </li>
          ))}
      </ul>
    </>
  );
};

export default TableOfContents;
