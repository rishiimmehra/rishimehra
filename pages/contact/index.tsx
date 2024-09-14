import React from 'react';
import { NextSeo } from "next-seo";
import ContactForm from 'components/ContactForm';

const seoTitle = "Contact | Rishi Mehra";
const seoDesc =
  "A designer/frontend developer hybrid that loves to build great products with delightful interfaces.";

export default function contact () {
  return (
    <>
      <NextSeo
        title={seoTitle}
        description={seoDesc}
        openGraph={{
          title: seoTitle,
          description: seoDesc,
          url: `https://rishimehra.in/about/`,
          site_name: "Rishi Mehra",
        }}
        twitter={{
          cardType: "summary_large_image",
        }}
      />
      <div className="flex flex-col gap-20">
        <div className="flex flex-col gap-20">
          <div className="flex flex-col gap-2">
            <h1 className="animate-in">Contact</h1>
            <p
              className="text-secondary animate-in"
              style={{ "--index": 1 } as React.CSSProperties}
            >
              Hey! Tell us all the things 
            </p>
          </div>
          <div
            className="animate-in"
            style={{ "--index": 2 } as React.CSSProperties}
          >
            <ContactForm/>
          </div>
        </div>
      </div>
  </>
  )
}