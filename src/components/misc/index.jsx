import React, { useEffect, useState } from "react";

function Misc() {
  const [image, setImage] = useState();

  const changeImage =  (e) =>{
    
    console.log(e.currentTarget.value ,"value of image")
    setImage(e.currentTarget.value);
  }
  return (
    <div>
      <input
        type="file"
        onChange={(e) => changeImage(e)}
        in
        placeholder="file"

      />

      <img src={image} className="size-[100px]" alt="" />
    </div>
  );
}

export default Misc;
