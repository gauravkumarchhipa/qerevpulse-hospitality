"use client";

import React from "react";

const Page = () => {
  return (
    <div style={{ width: "100vw", height: "100vh", margin: 0, padding: 0 }}>
      <iframe
        src="https://hospitality-intelligence.vercel.app/"
        style={{
          width: "100%",
          height: "100%",
          border: "none",
        }}
        allowFullScreen
      ></iframe>
    </div>
  );
};

export default Page;
