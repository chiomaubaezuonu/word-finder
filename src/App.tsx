import React, { useEffect, useRef, useState } from 'react';
import './App.css';
import './index.css';
import search from "./search.svg"
import speaker from "./speaker.png"
import axios from "axios"
// import { link } from 'fs';
import { useSpeechSynthesis } from 'react-speech-kit';
import leftArrow from "./leftArrow.png"
import rightArrow from "./rightArrow.png"

function App() {
  const { speak } = useSpeechSynthesis();
  interface words {
    word: string,
    phonetic: string,
    phonetics: { audio?: string }[];
    meanings: {
      partOfSpeech: string[],
      definitions: {
        definition: string,
        example: string,
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

  // const handlePlayAudio = () => {
  //   if (audioRef.current && wordData?.phonetics[0]?.audio) { // Check if audio exists
  //     audioRef.current.src = wordData.phonetics[0].audio;
  //     audioRef.current.play();
  //   }
  // };

  const handlePlayAudio = () => {
    if (wordData && wordData.word) {
      speak({ text: wordData.word });
    }
  };

  return (
    <div className="App w-full  rounded-lg  mx-auto pt-16 shadow-lg bg-[#f6d3b6] text-[#0F322E]">
      <div className="input-div w-full mx-auto">
        <h2 className='text-3xl mb-4 font-bold text-center'>Search for a word</h2>
        <span className='flex justify-between items-center relative mx-1'>
          <input value={searchedWord} onChange={handleInputValue} className='relative w-full outline-none rounded-lg py-4 px-2' type="text" placeholder='Search for a word...' />
          <img onClick={() => setSearchedWord(searchedWord)} className='absolute top-4 cursor-pointer right-0 px-2 z-10 w-11' src={search} alt='search icon' />
        </span>
      </div>
      <div className="word-div  rounded-3xl mt-7  px-5 leading-7 w-full py-10 h-screen mb-8shadow-md bg-white  ">
        <div>
          <img src={leftArrow} alt='left double arrow' />
          <h1 className='text-center text-2xl'>{searchedWord}</h1>
          <img src={rightArrow} alt='right double arrow' />
        </div>
        {wordData?.word && (

          <img onClick={handlePlayAudio} className='rounded-full mx-auto mt-3 cursor-pointer' src={speaker} alt='speaker' />
        )}
        {wordData &&
          <div>
            <li className='italic font-light font-lato'>{wordData.phonetic}</li>
            <p>{wordData.meanings[0].partOfSpeech}</p>

            {wordData.meanings && wordData.meanings.map((meaning) => (
              <div>
                {wordData.meanings[0].definitions.map(i => (
                  <div >
                    <p>{i.definition}</p>
                    <p className='italic text-gray-400'>{i.example}</p>
                  </div>
                ))}

                {/* {meaning.definitions.map((definition) => (
                  <div>
                    <p>{definition.definition}</p>
                    {definition.example && <p className='italic text-gray-400'>{definition.example}</p>}
                    {definition.synonyms ? <li className='#0F322E'>Synonyms for {searchedWord}: {definition.synonyms}</li> : ""}
                  </div>
                ))} */}
              </div>
            ))}
            <div className='bg-[#f6d3b6] p-4 rounded-lg'>
              <p className='text-center'>Source: {wordData.sourceUrls}</p>

            </div>
          </div>
        }
      </div>
    </div>
  );
}

export default App;
