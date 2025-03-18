import React from "react";
import { Gamepad2, Tag, MessageCircle, Phone, User, Ticket } from "lucide-react";
import "./HomePage.css"; // Import CSS

const HomePage = ({ category, game, review, contact, user, ticket }) => {
  const items = [
    { icon: <Tag size={50} />, label: "Category", value: category },
    { icon: <Gamepad2 size={50} />, label: "Game", value: game },
    { icon: <MessageCircle size={50} />, label: "Review", value: review },
    { icon: <Phone size={50} />, label: "Contact", value: contact },
    { icon: <User size={50} />, label: "User", value: user },
    { icon: <Ticket size={50} />, label: "Ticket", value: ticket },
  ];

  return (
    <div className="container1">
      {items.map((item, index) => (
        <div key={index} className="card1">
          {item.icon}
          <h6 className="lable1">{item.label}</h6>
          <p className="value1">{item.value}</p>
        </div>
      ))}
    </div>
  );
};

export default HomePage;
