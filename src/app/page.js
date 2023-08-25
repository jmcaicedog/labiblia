"use client";
import Book from "@/components/Book";
import Navbar from "@/components/Navbar";
import { useState, useEffect } from "react";
import axios from "axios";

export default function Home() {
  const [book, setBook] = useState(null);

  useEffect(() => {
    axios.get("https://bolls.life/get-books/NTV/").then((response) => {
      setBook(response.data);
    });
  }, []);

  if (!book) return null;

  return (
    <>
      <Navbar />
      {book.map((b) => (
        <Book name={b.name} />
      ))}
    </>
  );
}
