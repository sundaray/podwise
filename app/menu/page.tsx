"use client"

import { useState } from "react";
import Divide from "@/components/divide";

export default function Home() {
  const [isOpen, setOpen] = useState(false);

  return (
    <div className="your-container">
      <div className="navbar">
        <Divide
          toggled={isOpen}
          toggle={setOpen}
          color="#333"
          rounded
          size={30}
        />
        {/* Rest of your navbar */}
      </div>

      {/* Conditional menu rendering based on isOpen state */}
      {isOpen && <div className="mobile-menu">{/* Your menu items */}</div>}
    </div>
  );
}
