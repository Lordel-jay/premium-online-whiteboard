import {useState} from "react";

export default function Register(){

const [name,setName] = useState("");
const [email,setEmail] = useState("");
const [password,setPassword] = useState("");

const register = async ()=>{

 await fetch("http://localhost:5000/api/auth/register",{

  method:"POST",

  headers:{
   "Content-Type":"application/json"
  },

  body:JSON.stringify({name,email,password})

 });

 alert("User registered");

};

return(

<div>

<h2>Register</h2>

<input placeholder="Name" onChange={(e)=>setName(e.target.value)} />

<input placeholder="Email" onChange={(e)=>setEmail(e.target.value)} />

<input type="password" placeholder="Password" onChange={(e)=>setPassword(e.target.value)} />

<button onClick={register}>Register</button>

</div>

);

}