import { createBrowserRouter } from "react-router-dom";
import Index from "./index";
import Root, { loader as rootLoader, action as rootAction } from "./root";
import Contact, {
  loader as contactLoader,
  action as contactAction,
} from "./contact";
import ErrorPage from "../error-page";
import EditContact, { action as editContactAction } from "./edit";
import { action as destroyAction } from "./destroy";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    loader: rootLoader,
    action: rootAction,
    errorElement: <ErrorPage />,
    children: [
      {
        errorElement: <ErrorPage />,
        children: [
          { index: true, element: <Index /> },
          {
            path: "contacts/:contactId",
            element: <Contact />,
            loader: contactLoader,
            action: contactAction,
          },
          {
            path: "contacts/:contactId/edit",
            element: <EditContact />,
            loader: contactLoader,
            action: editContactAction,
          },
          {
            path: "contacts/:contactId/destroy",
            action: destroyAction,
            errorElement: <h1>Something went wrong</h1>,
          },
        ],
      },
    ],
  },
]);
