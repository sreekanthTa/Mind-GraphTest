import "./App.css";
import { useState, useEffect, useRef } from "react";
import { NavLink } from "react-router-dom";
import { Router } from "react-router-dom";
import { Link } from "react-router-dom";
import React  from 'react';

function Home() {
  const [text, setText] = useState("");
  const [isReady, setIsReady] = useState(false);
  const refName = useRef();
  const refImg = useRef();

  
  const updateName = () =>{

    const inputValue = refName?.current?.value;

    if(inputValue === "Ready!"){
      setText(inputValue)
      setIsReady(true)
    }

  }

 


  return (
    <div className="App">
      <header className="App-header">
          
         <Link to="/pokedex">
         <img
          hidden={!isReady}
          src="https://www.freeiconspng.com/uploads/file-pokeball-png-0.png"
          className="App-logo"
          alt="logo"
          style={{ padding: "10px", cursor:"pointer" }}
        />

         </Link>
        
        
        {/* <b>
          Requirement: Try to show the hidden image and make it clickable that
          goes to /pokedex when the input below is "Ready!" remember to hide the
          red text away when "Ready!" is in the textbox.
        </b> */}
        <p>Are you ready to be a pokemon master?</p>
        <input onChange={updateName} ref={refName} type="text" name="name" />
        {!isReady&&<span style={{ color: "red" }}>I am not ready yet!</span>}
      </header>
    </div>
  );
}

export default Home;
