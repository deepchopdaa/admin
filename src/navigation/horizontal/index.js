import { title } from "process";
import { Mail, Home } from "react-feather";

export default [
  {
    id: "home",
    title: "Home",
    icon: <Home size={20} />,
    navLink: "/home",
  },
  {
    id: "secondPage",
    title: "Second Page",
    icon: <Mail size={20} />,
    navLink: "/second-page",
  },
  {
    id:"LoginPage",
    title:"Login",
    navLink: "/login",
  },
  {
    id:"RegisterPage",
    title:"Register",
    navLink: "/register",
  },
  {
    id:"CategoryForm",
    title:"CategoryForm",
    navLink:'/categoryform',
  },
  {
    id:"Category",
    title:"Category",
    navLink:'/category',
  }
];
