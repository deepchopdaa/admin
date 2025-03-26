import { Fragment, lazy } from "react";
import { Navigate } from "react-router-dom";
import BlankLayout from "@layouts/BlankLayout";
import VerticalLayout from "@src/layouts/VerticalLayout";
import HorizontalLayout from "@src/layouts/HorizontalLayout";
import LayoutWrapper from "@src/@core/layouts/components/layout-wrapper";
import PublicRoute from "@components/routes/PublicRoute";
import { isObjEmpty } from "@utils";

// ** Protected Route Import
import ProtectedRoute from "./protected"; 

const getLayout = {
  blank: <BlankLayout />,
  vertical: <VerticalLayout />,
  horizontal: <HorizontalLayout />,
};

const TemplateTitle = "%s - Vuexy React Admin Template";
const DefaultRoute = "/login";

// ** Lazy Loaded Components
const Home = lazy(() => import("../../views/Home"));
const SecondPage = lazy(() => import("../../views/SecondPage"));
const Login = lazy(() => import("../../views/Login"));
const Register = lazy(() => import("../../views/Register"));
const ForgotPassword = lazy(() => import("../../views/ForgotPassword"));
const Error = lazy(() => import("../../views/Error"));
const CategoryForm = lazy(() => import("../../views/CategoryForm"));
const CategoryTable = lazy(() => import("../../views/CategoryTable"));
const GameTable = lazy(() => import("../../views/Gametable"));
const GameForm = lazy(() => import("../../views/GameForm"));
const Contact = lazy(() => import("../../views/Contact"));
const User = lazy(() => import("../../views/UserDetail"));
const Review = lazy(() => import("../../views/Review"));
const Ticket = lazy(() => import("../../views/Ticket"));
const Slider = lazy(() => import("../../views/Slider"));
const SliderForm = lazy(() => import("../../views/SliderForm"));
const NotFound = lazy(() => import("../../views/NotFound"));

// ** Routes
const Routes = [
  { path: "/", index: true, element: <Navigate replace to={DefaultRoute} /> },
  { path: "/home", element: <ProtectedRoute><Home /></ProtectedRoute> },
  { path: "/second-page", element: <ProtectedRoute><SecondPage /></ProtectedRoute> },
  { path: "/categoryform", element: <ProtectedRoute><CategoryForm /></ProtectedRoute> },
  { path: "/category", element: <ProtectedRoute><CategoryTable /></ProtectedRoute> },
  { path: "/game", element: <ProtectedRoute><GameTable /></ProtectedRoute> },
  { path: "/user", element: <ProtectedRoute><User /></ProtectedRoute> },
  { path: "/review", element: <ProtectedRoute><Review /></ProtectedRoute> },
  { path: "/gameform", element: <ProtectedRoute><GameForm /></ProtectedRoute> },
  { path: "/contact", element: <ProtectedRoute><Contact /></ProtectedRoute> },
  { path: "/ticket", element: <ProtectedRoute><Ticket /></ProtectedRoute> },
  { path: "/slider", element: <ProtectedRoute><Slider /></ProtectedRoute> },
  { path: "/sliderform", element: <ProtectedRoute><SliderForm /></ProtectedRoute> },
  { path: "/login", element: <Login />, meta: { layout: "blank" } },
  { path: "/register", element: <Register />, meta: { layout: "blank" } },
  { path: "/forgot-password", element: <ForgotPassword />, meta: { layout: "blank" } },
  { path: "/error", element: <Error />, meta: { layout: "blank" } },
  { path: "/*", element: <NotFound /> },
];

const getRouteMeta = (route) => {
  if (isObjEmpty(route.element.props)) {
    return route.meta ? { routeMeta: route.meta } : {};
  }
};

// ** Return Filtered Array of Routes & Paths
const MergeLayoutRoutes = (layout, defaultLayout) => {
  return Routes.filter((route) => {
    let isBlank = false;
    if (
      (route.meta && route.meta.layout === layout) ||
      (!route.meta?.layout && defaultLayout === layout)
    ) {
      const RouteTag = PublicRoute;
      isBlank = route.meta?.layout === "blank";
      const Wrapper = isObjEmpty(route.element.props) && !isBlank ? LayoutWrapper : Fragment;
      route.element = (
        <Wrapper {...(!isBlank ? getRouteMeta(route) : {})}>
          <RouteTag route={route}>{route.element}</RouteTag>
        </Wrapper>
      );
      return true;
    }
    return false;
  });
};

const getRoutes = (layout) => {
  const defaultLayout = layout || "vertical";
  const layouts = ["vertical", "horizontal", "blank"];
  return layouts.map((layoutItem) => ({
    path: "/",
    element: getLayout[layoutItem] || getLayout[defaultLayout],
    children: MergeLayoutRoutes(layoutItem, defaultLayout),
  }));
};

export { DefaultRoute, TemplateTitle, Routes, getRoutes };
