import { redirect } from "react-router-dom";
import { deleteContact } from "../contact";

export async function action({ params }) {
  const { contactId } = params;
  await deleteContact(contactId);
  return redirect("/");
}
