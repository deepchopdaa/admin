import axios from "axios";
import { useEffect, useState } from "react";


const Home = () => {
  const [category, setcategory] = useState();
  const [game, setgame] = useState()
  const [contact, setcontact] = useState()
  const [review, setreview] = useState()
  const [ticket, setticket] = useState()
  const [user, setuser] = useState();
  const [allcount, setallcount] = useState(null)
  const GetCount = () => {
    axios.get("http://localhost:3100/admin/getCount").then((count) => {
      setallcount(count.data);
      setcategory(count.data.category);
      setgame(count.data.game)
      setcontact(count.data.contact)
      setreview(count.data.review)
      setuser(count.data.user)
      setticket(count.data.ticket)
      console.log(count.data)
    }).catch((e) => {
      console.log("Data Count Getting Error", e);
    })
  }
  useEffect(() => {
    GetCount();
  }, [])
  return (
    <div>

      
      <h6>{category}</h6>
      <h6>{game}</h6>
      <h6>{review}</h6>
      <h6>{contact}</h6>
      <h6>{user}</h6>
      <h6>{ticket}</h6>
      
    </div>
  );
};

export default Home;
