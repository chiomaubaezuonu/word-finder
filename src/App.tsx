import React, { useEffect, useRef, useState } from 'react';
import './App.css';
import './index.css';
import search from "./search.svg"
import speaker from "./speaker.png"
import axios from "axios"
import { link } from 'fs';

function App() {
  interface words {
    phonetic: string,
    phonetics: { audio?: string }[];
    meanings: {
      partOfSpeech: string[],
      definitions: {
        definition: string,
        synonyms?: []
      }[],

    }[],
    sourceUrls?: string[]
  }


  const [searchedWord, setSearchedWord] = useState<string>("")
  // const [displayedWords, setDisplayedWords] = useState<words[] | null>([])
  const [wordData, setWordData] = useState<words | null>(null)
  const audioRef = useRef<HTMLAudioElement | null>(null);




  // useEffect(() => {
  //   if (searchedWord.trim() !== " ") {
  //     axios.get(`https://api.dictionaryapi.dev/api/v2/entries/en/${searchedWord}`)
  //       .then(response => {
  //         setDisplayedWords(response.data)
  //       })
  //   }
  // }, [searchedWord])
  useEffect(() => {
    const fetchData = async () => {
      if (searchedWord.trim() !== "") {
        try {
          const response = await axios.get(
            `https://api.dictionaryapi.dev/api/v2/entries/en/${searchedWord}`
          );
          // setDisplayedWords(response.data);
          setWordData(response.data[0])
        } catch (error) {
          console.error('Error fetching data:', error);
        }
      } else {
        setWordData(null);
      }
    };

    fetchData();
  }, [searchedWord]);

  const handleInputValue = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault()
    setSearchedWord(e.target.value)
  }

  const handlePlayAudio = () => {
    if (audioRef.current && wordData?.phonetics[0]?.audio) { // Check if audio exists
      audioRef.current.src = wordData.phonetics[0].audio;
      audioRef.current.play();
    }
  };

  return (
    <div className="App w-11/12  rounded-lg  mx-auto pt-16 shadow-lg my-12 bg-[#f6d3b6] text-[#0F322E]">
      <div className="input-div w-10/12 mx-auto">
        <h2 className='text-3xl mb-4 font-bold text-center'>Search for a word</h2>
        <span className='flex justify-between relative'>
          <input value={searchedWord} onChange={handleInputValue} className='relative w-full outline-none rounded-md py-4 px-2' type="text" placeholder='Search for a word...' />
          <img onClick={() => setSearchedWord(searchedWord)} className='absolute top-4 cursor-pointer right-8 z-10 w-8' src={search} alt='search icon' />
        </span>
      </div>
      <div className="word-div  rounded-xl mt-7  px-4 w-full py-10 h-screen mb-8shadow-md bg-white  ">
        <h1 className='text-center text-2xl'>{searchedWord}</h1>
        <img onClick={handlePlayAudio} className='rounded-full mx-auto mt-3' src={speaker} alt='speaker' />
        <audio ref={audioRef} />
        {/* {displayedWords && displayedWords.map((word, index) => (
          <div key={index}>
            <p>{word.phonetic}</p>
            <p>{word.sourceUrls}</p>
            {word.meanings && word.meanings.map(item => (
              <div>
                <li>{item.partOfSpeech}</li>
                {item.definitions.map((definition) => (
                  <div>
                    <li className='bg-green-900 text-white'>{definition.definition}</li>
                    <li className='bg-yellow-400'>Synonyms for {searchedWord}: {definition.synonyms}</li>
                  </div>
                ))}

              </div>
            ))}
          </div>
        ))} */}
        {wordData &&
          <div>
            <li>{wordData.sourceUrls}</li>
            <li>{wordData.phonetic}</li>
            {wordData.meanings && wordData.meanings.map((meaning) => (
              <div>
                <li>{meaning.partOfSpeech}</li>
                {meaning.definitions.map((definition) => (
                  <div>
                    <p>{definition.definition}</p>
                    {definition.synonyms && <li>Synonyms for {searchedWord}: {definition.synonyms}</li>}
                  </div>
                ))}
              </div>
            ))}
          </div>
        }
      </div>
    </div>
  );
}

export default App;
