"use client";
import React from "react";

const Page = () => {
  return (
    <div className="w-full max-w-[1500px] mx-auto p-2 md:p-6 h-screen overflow-hidden">
      <iframe
        title="hospitality-v1"
        src="https://app.powerbi.com/view?r=eyJrIjoiZDIxZDgyY2EtZTQ0ZC00YjE4LWI5MDktZWNiNGY1MWY4Zjg4IiwidCI6IjYwYzg2NjQ3LTljYTMtNDg3Yi1iYzM5LWI0ZTM1MTU5NDAxNSJ9"
        className="w-full h-full border-0"
        allowFullScreen
      ></iframe>
    </div>
  );
};

export default Page;
