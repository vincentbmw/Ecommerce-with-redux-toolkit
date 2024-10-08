import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeftIcon } from '@heroicons/react/24/solid';

const NotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 text-center">
      <h1 className="text-6xl font-bold text-gray-800 mb-4">404</h1>
      <p className="text-2xl text-gray-600 mb-8">Oops! The page you're looking for does not exist.</p>
      <Link
        to="/"
        className="flex items-center px-4 py-2 bg-blue-600 text-white text-lg font-semibold rounded-md hover:bg-blue-500 transition-colors"
      >
        <ArrowLeftIcon className="h-6 w-6 mr-2" />
        Go Back Home
      </Link>
    </div>
  );
};

export default NotFound;