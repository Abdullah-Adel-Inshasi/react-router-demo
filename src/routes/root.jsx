import { Outlet, redirect, useLoaderData, useNavigation } from "react-router";
import { Form, NavLink, useSubmit } from "react-router-dom";
import { getContacts, createContact } from "../contact";
import { useEffect, useMemo } from "react";
export async function loader({ request }) {
  const url = new URL(request.url);
  const query = url.searchParams.get("q");
  const contacts = await getContacts(query);
  return { contacts, query };
}

export async function action() {
  const contact = await createContact();

  return redirect(`/contacts/${contact.id}/edit`);
}

export default function Root() {
  const { contacts, query } = useLoaderData();
  const navigation = useNavigation();
  const submit = useSubmit();

  const searching =
    navigation.location &&
    new URLSearchParams(navigation.location.search).has("q");
  useEffect(() => {
    document.getElementById("q").value = query;
  }, [query]);

  return (
    <>
      <div id="sidebar">
        <h1>React Router Contacts</h1>
        <div>
          <Form id="search-form" role="search">
            <input
              id="q"
              className={searching ? "loading" : ""}
              aria-label="Search contacts"
              placeholder="Search"
              type="search"
              name="q"
              onChange={(e) => {
                const isFirstSearch = query === null;
                submit(e.target.form, { replace: !isFirstSearch });
              }}
            />
            <div id="search-spinner" aria-hidden hidden={!searching} />
            <div className="sr-only" aria-live="polite"></div>
          </Form>
          <Form method="post">
            <button type="submit">New</button>
          </Form>
        </div>
        <nav>
          {contacts.length ? (
            <ul>
              {contacts.map((contact) => (
                <li key={contact.id}>
                  <NavLink
                    className={({ isActive, isPending }) => {
                      if (!isActive && !isPending) return "";
                      if (isActive) return "active";
                      if (isPending) return "pending";
                    }}
                    to={`contacts/${contact.id}`}
                  >
                    {contact.first || contact.last ? (
                      <>
                        {contact.first} {contact.last}
                      </>
                    ) : (
                      <i>No Name</i>
                    )}{" "}
                    {contact.favorite && <span>★</span>}
                  </NavLink>
                </li>
              ))}
            </ul>
          ) : (
            <p>
              <i>No contacts</i>
            </p>
          )}
        </nav>
      </div>
      <div
        id="detail"
        className={navigation.state === "loading" ? "loading" : ""}
      >
        <Outlet />
      </div>
    </>
  );
}
