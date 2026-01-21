import axios from "axios";
import { useEffect, useState } from "react";
import HomePage from "./HomePage";
import { t } from "i18next";


const Home = () => {
  const [category, setcategory] = useState();
  const [game, setgame] = useState()
  const [contact, setcontact] = useState()
  const [review, setreview] = useState()
  const [ticket, setticket] = useState()
  const [user, setuser] = useState();
  const [allcount, setallcount] = useState(null)
  const GetCount = () => {
    axios.get("https://gamezone-r2eq.onrender.com/admin/getCount").then((count) => {
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
      <div className="min-h-screen flex justify-center items-center bg-gray-900">
        <HomePage category={category} game={game} review={review} contact={contact} user={user} ticket={ticket} />
      </div>
    </div>
  );
};

export default Home;
