import { setDefaultResultOrder } from "dns";
import React, { useState, useEffect } from "react";
import "./App.css";

const App: React.FC = () => {
  interface StarWarsCharacter {
    name: string;
  }

  const [character, setCharacter] = useState<string>("");
  const [errorMsg, setErrorMsg] = useState<string | undefined>("");

  useEffect(() => {
    getCharacter(1);
  }, []);

  const getCharacter = async (id: number) => {
    const apiResponse = await fetch(`https://swapi.dev/api/people/${id}`);
    try {
      console.log("******=>***", apiResponse);
      if (apiResponse.ok) {
        const json = await apiResponse.json();
        console.log("response =>", apiResponse.status);
        console.log("jason =>", json);
        setCharacter(json.name);
      } else {
        if (apiResponse.status === 500) {
          setErrorMsg(`Oops... something went wrong, try again`);
        } else if (apiResponse.status === 418) {
          setErrorMsg(`418 I'm a teapot`);
        }
      }
    } catch (error) {
      console.log("error => ", error);
    }
  };

  return (
    <div>
      <h1>Starwars Character</h1>
      <h2>Name : {character}</h2>
      <h3>{errorMsg}</h3>
    </div>
  );
};

export default App;
