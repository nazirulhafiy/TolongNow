import React, { type SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement>;
const base = { width: 22, height: 22, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 1.8, strokeLinecap: "round" as const, strokeLinejoin: "round" as const, "aria-hidden": true };

export const PinIcon = (props: IconProps) => <svg {...base} {...props}><path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z"/><circle cx="12" cy="10" r="2.5"/></svg>;
export const PhoneIcon = (props: IconProps) => <svg {...base} {...props}><path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.4 19.4 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 2 .7 2.9a2 2 0 0 1-.5 2.1L8.1 9.9a16 16 0 0 0 6 6l1.2-1.2a2 2 0 0 1 2.1-.5c.9.3 1.9.6 2.9.7a2 2 0 0 1 1.7 2Z"/></svg>;
export const ArrowIcon = (props: IconProps) => <svg {...base} {...props}><path d="M5 12h14M13 6l6 6-6 6"/></svg>;
export const CloudIcon = (props: IconProps) => <svg {...base} {...props}><path d="M17.5 19H6a4 4 0 0 1-.8-7.9A7 7 0 0 1 18.7 9 5 5 0 0 1 17.5 19Z"/><path d="m9 22 1-2m4 2 1-2"/></svg>;
export const ShieldIcon = (props: IconProps) => <svg {...base} {...props}><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z"/><path d="m9 12 2 2 4-4"/></svg>;
export const ExternalIcon = (props: IconProps) => <svg {...base} {...props}><path d="M15 3h6v6m0-6-9 9"/><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/></svg>;
export const AlertIcon = (props: IconProps) => <svg {...base} {...props}><path d="M10.3 2.9 1.8 17a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 2.9a2 2 0 0 0-3.4 0Z"/><path d="M12 9v4m0 4h.01"/></svg>;
export const PeopleIcon = (props: IconProps) => <svg {...base} {...props}><circle cx="9" cy="7" r="4"/><path d="M2 21v-2a7 7 0 0 1 14 0v2M16 3.1a4 4 0 0 1 0 7.8M22 21v-2a7 7 0 0 0-5-6.7"/></svg>;
export const MoonIcon = (props: IconProps) => <svg {...base} {...props}><path d="M21 12.8A9 9 0 1 1 11.2 3 7 7 0 0 0 21 12.8Z"/></svg>;
export const SunIcon = (props: IconProps) => <svg {...base} {...props}><circle cx="12" cy="12" r="4"/><path d="M12 2v2m0 16v2M4.9 4.9l1.4 1.4m11.4 11.4 1.4 1.4M2 12h2m16 0h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg>;
