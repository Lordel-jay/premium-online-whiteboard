import {useState} from "react";

export default function Login(){

const [email,setEmail] = useState("");
const [password,setPassword] = useState("");

const login = async ()=>{

 const res = await fetch("http://localhost:5000/api/auth/login",{

  method:"POST",

  headers:{
   "Content-Type":"application/json"
  },

  body:JSON.stringify({email,password})

 });

 const data = await res.json();

 console.log(data);

};

return(

<div>

<h2>Login</h2>

<input placeholder="Email" onChange={(e)=>setEmail(e.target.value)} />

<input type="password" placeholder="Password" onChange={(e)=>setPassword(e.target.value)} />

<button onClick={login}>Login</button>

</div>

);

}