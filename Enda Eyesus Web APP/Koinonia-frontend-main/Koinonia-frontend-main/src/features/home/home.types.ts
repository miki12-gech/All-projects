import { LucideIcon } from "lucide-react";

export interface ServiceClassFeature {
    id: string;
    title: string;
    description: string;
    icon: LucideIcon;
    color: string;
}

export interface TimelineEvent {
    year: string;
    title: string;
    description: string;
}

export interface Testimonial {
    id: string;
    name: string;
    department: string;
    quote: string;
    serviceClass: string;
}
