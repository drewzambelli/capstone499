import React from 'react';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="text-center bg-gray-800 text-dark py-4 fixed bottom-0 w-full">
      <div className="max-w-7xl mx-auto px-4">
        <p className="m-0 text-sm">
          &copy; {currentYear} Locally. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
