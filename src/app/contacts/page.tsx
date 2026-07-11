import type { Metadata } from "next";
import { ContactsContent } from "@/components/localized-pages";

export const metadata: Metadata = { title: "Emergency contacts" };
export default function ContactsPage(){return <ContactsContent/>}
