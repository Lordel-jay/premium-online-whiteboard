import {useEffect,useState} from "react";

export default function AdminDashboard(){

const [boards,setBoards] = useState([]);

useEffect(()=>{

 fetch("http://localhost:5000/api/board/all")
 .then(res=>res.json())
 .then(data=>setBoards(data));

},[]);

return(

<div>

<h2>Admin Dashboard</h2>

{boards.map(board=>(
<div key={board._id}>

<h3>{board.title}</h3>

<p>Created by: {board.createdBy}</p>

</div>
))}

</div>

);

}