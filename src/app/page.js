"use client";
import Chapter from "@/components/Chapter";
import Navbar from "@/components/Navbar";

export default function Home() {
  return (
    <>
      <Navbar />
      <Chapter translation="NTV" bookNumber="1" chapterNumber="2" />
    </>
  );
}
