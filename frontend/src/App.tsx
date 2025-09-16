<<<<<<< HEAD
import React from "react";

function App() {
  return <div className="text-amber-950">App</div>;
=======
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";


function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />   
      </Routes>
    
    </>
  );
>>>>>>> 27203740a9c8fe58b8c3ff5574fb904908a19126
}

export default App;
