import { useState } from "react";
import { AboutTabType } from "./about.types";

export const useAbout = () => {
    const [activeTab, setActiveTab] = useState<AboutTabType>("general");

    return {
        activeTab,
        setActiveTab
    };
};
