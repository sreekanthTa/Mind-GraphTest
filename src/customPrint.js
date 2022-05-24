import React from "react";


export const  CustomPrint = (props) =>{



     console.log("inside")


    return <>
      

    <div>{props?.children}</div>
    <button onClick={window.print()}>PRINT</button>
    </>


}