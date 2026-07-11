import type { Metadata } from "next";
import { AboutContent } from "@/components/localized-pages";
export const metadata:Metadata={title:"Safety & limitations"};
export default function AboutData(){return <AboutContent/>}
