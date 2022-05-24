import "./App.css";
import React, { useState, useEffect, useRef } from "react";
import ReactLoading from "react-loading";
import axios from "axios";
import Modal from "react-modal";
import { CustomPrint } from "./customPrint";

import { Chart } from 'react-charts'
const sortObjectsArray = require('sort-objects-array');


function PokeDex() {
  const [pokemons, setPokemons] = useState([]);
  const [pokemonsStats, setPokemonsStats] = useState([]);
  const [copyPokemonsStats, setcopyPokemonsStats] = useState([]);
  const [pokemonDetail, setPokemonDetail] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const initalLimit = 5;
  const [limit, setLimit] = useState(initalLimit);
  const [checks, setchecks] = useState(false);



 

  const searchInputRef =useRef();




  //Load inital data
   useEffect(  ()=>{

    (async ()=>{

      setIsLoading(true);
    
      const results = await axios.get('https://pokeapi.co/api/v2/pokemon');

      if(results?.data?.results){
          setPokemons(results?.data?.results);
          setcopyPokemonsStats(results?.data?.results);
      }

      setIsLoading(false)

    })();
  
   return () => {}

  },[]);

 
  

  //Load list item details
  const itemDetails = async(e) => {
   

    const index = e?.target?.getAttribute('data-key');

    const itemDetail = pokemons[index];

    setPokemonDetail(itemDetail);
    setIsLoading(true)

    const results = await axios.get(`${itemDetail?.url}`);

    setPokemonsStats(results?.data);
    setchecks(true)
    setIsLoading(false)


  }

  //Input search method
  const inputMethod = () =>{

     const text = searchInputRef.current.value;
    
     setPokemons(copyPokemonsStats?.filter((e)=>{

     const data = e.name?.includes(text)
    
     return data;
    
    }))



  }

 //Pagination for 5, 10, 15, 20
  const noPagination = (e) =>{

     const value = e?.target.getAttribute("data-key");

     setLimit(value)

  }


  const [rights, setrights] = useState(limit)

  const [first, setfirst] = useState(false)

 

  //For top page
  const topPage = () => {

    const copyData = [...copyPokemonsStats];


    if(first){

      if((rights*1)  -  (limit*1)<=0) {

        setrights(  (limit*1));


        const dat = copyData.slice(0, (limit*1));


      return setPokemons(dat);


      }
      setrights((rights*1)  -  (limit*1))

      const dat = copyData.slice((rights*1)-(limit*1), (rights*1));
  
      setPokemons(dat);



    } else {

      
      setrights(rights  -  (2*limit))

      const copyData = [...copyPokemonsStats];
  
      const dat = copyData.slice(rights-(2*limit), rights);
  
  
      setPokemons(dat);
    setsecond(false)
     
    }

    setfirst(true);

   
  }


  const [second, setsecond] = useState(false)

  const [instate,setinState] = useState(true);

 

  
  //For bottom page
  const bottomPage = () => {

    if(second || instate) {

      if(rights>=copyPokemonsStats?.length ) return

      setrights( (rights *1)  + (limit *1))

      const copyData = [...copyPokemonsStats];
  
      const dat = copyData.slice(rights, rights+limit);
  
  
      setPokemons(dat);
      setinState(false)


    } else if(first){


      let  k = 0;

      if(rights == 0) k = limit


      setrights( ((rights*1)+(k*1))  + (limit*1))

      const copyData = [...copyPokemonsStats];
  
      const dat = copyData.slice(((rights*1)+(k*1)), rights+(2*limit));
  
  
      setPokemons(dat);
    }
    setsecond(true);
    setfirst(false)

 
 

  }


  
  const customStyles = {
    content: {
      top: "50%",
      left: "50%",
      right: "auto",
      bottom: "auto",
      marginRight: "-50%",
      transform: "translate(-50%, -50%)",
      background: "white",
      color: "black",
      textAlign:"center"
    },
    overlay: { backgroundColor: "rgb(0 0 0 / 96%)" },
  };


 

  //Chart data
  const data = React.useMemo(
    () => [
      {
        label: 'stats',
        data: checks ? pokemonsStats?.stats?.map((e,i) =>{
          return  [ i, e?.base_stat ]
          })  :[]
      },
      
    ],
    [checks,pokemonsStats]
  )
  //Chart type
  const series = React.useMemo(
    () => ({
      type: 'bar'
    }),
    []
  )

  //Chart params
  const axes = React.useMemo(
    () => [
      { primary: true, type: 'ordinal', position: 'left' },
      { position: 'bottom', type: 'linear', stacked: true }
    ],
    []
  )

//Chart
  const BarChart = (
    // A react-chart hyper-responsively and continuously fills the available
    // space of its parent element automatically
    <div
      style={{
        width: '200px',
        height: '150px'
      }}
    >
  { checks ?  <Chart data={data} series={series} axes={axes} /> : <span></span>}  
    </div>
  )


const [prins, setprins] = useState(false);


//Sort
const sort =  (e)=>{

 const sortedData = sortObjectsArray(pokemons, 'name',{order: e?.target.getAttribute("data-key"), caseinsensitive: true});
 
 setPokemons(sortedData)
 setPokemonsStats(sortedData)

}

const prints = () =>{

  setprins(!prins)
}


  if (!isLoading && pokemons.length === 0) {
    return (
      <div>
        <header className="App-header">
          <h1>Welcome to pokedex !</h1>
        </header>
      </div>
    );
  }

  return (
    <div>
      <header className="App-header">
        {isLoading ? (
          <>
            <div className="App">
              <header className="App-header">
              <ReactLoading     height={100} width={100} />

              </header>
            </div>
          </>
        ) : (
          <>
            <h1>Welcome to pokedex !</h1>

            <input onKeyUp={inputMethod} ref={searchInputRef}></input>

            <ul onClick={itemDetails}>      
              
                {pokemons?.length>0 && pokemons?.map((e,i)=>{

                      if( i >= limit) return;

                    return <li className="items" data-key={i} key ={i}> {e?.name || ""}</li>

                  })}
              
            </ul>
                <span style={{display:"flex"}}>
               
               <button onClick={topPage}> {"<"}</button>
              <span style={{display:"flex"}}>
                { 
                  ["5","10","15","20"]?.map((e,i) => <span  onClick={noPagination}  data-key={e} style={{border:"1px solid white",  padding:"2px", margin:"2px"}}>{e}</span>)
                }
            </span>
                <button onClick={bottomPage}> {">"}</button>

                </span>

                <span style={{display:"flex", margin:"2px"}}>

                <button data-key="asc" onClick={sort}>Sort asc</button>
                <button data-key="desc" onClick={sort}>Sort des</button>
                </span>


          </>
        )}
      </header>
      {pokemonDetail && !prins && pokemonsStats?.stats && pokemonsStats?.stats?.length > 0 &&(
        
        <Modal
          isOpen={pokemonDetail}
          contentLabel={pokemonDetail?.name || ""}
          onRequestClose={() => {
            setPokemonDetail(null);
          }}
          style={customStyles}
        >

          <div style={{textAlign:"center", padding:"5px",  }}>

              <img src={pokemonsStats?.sprites?.front_default} alt="logo" style={{ padding: "1px",   }} />

              <div  >
                 
              <table cellpadding="3px"> 

                      <tr>
                        <th>No</th>
                        <th>Name</th>
                        <th>&nbsp;Base Stat&nbsp;</th>
                      </tr>

                      {pokemonsStats?.stats?.map((e,i) =>{
                        return    <tr  key={i} >
                                      <td>{i}</td>
                                      <td>{e?.stat?.name}</td>
                                      <td>{e?.base_stat}</td>
                                  </tr>
                        })  }
          
              </table>

              </div>
 
          </div>
          {pokemonsStats?.stats && pokemonsStats?.stats?.length>0 &&BarChart}

          <button onClick={prints}>Print PDF</button>

        </Modal>
     
      )}

      {prins&&pokemonDetail&&(
      <CustomPrint>
              <Modal
                isOpen={pokemonDetail}
                contentLabel={pokemonDetail?.name || ""}
                onRequestClose={() => {
                  setPokemonDetail(null);
                  setprins(false)

                }}
                style={customStyles}
              >
      
                <div style={{textAlign:"center", padding:"5px"}}>
                
                    <img src={pokemonsStats?.sprites?.front_default} alt="logo" style={{ padding: "1px",   }} />

                    <table cellpadding="3px"> 
                            <tr>
                              <th>Name</th>
                              <th>&nbsp;Base Stat&nbsp;</th>
                            </tr>

                            {pokemonsStats?.stats?.map((e,i) =>{
                              return    <tr   >
                                            <td>{e?.stat?.name}</td>
                                            <td>{e?.base_stat}</td>
                                        </tr>
                              })  }
                
                    </table>
      
                    {BarChart}

                </div>

              </Modal>

         </CustomPrint>

      )}
    </div>
  );
}

export default PokeDex;
