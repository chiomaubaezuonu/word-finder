import React from 'react';
import './App.css';
import './index.css';
import search from "./search.svg"

function App() {
  return (
    <div className="App w-full px-40 py-32 bg-[#F6C6A1] text-[#0F322E]">
    <div className="input-div">
      <h2 className='text-3xl font-bold text-center'>Search for a word</h2>
      <span className='flex justify-between relative'>
            <input className='relative w-full rounded-md py-4 px-2'  type="text" placeholder='Search for a word...' />
            <img  className='absolute top-4 cursor-pointer right-8 z-10 w-8' src={search} alt='search icon' />
          </span>
      
    </div>
    </div>
  );
}

export default App;
