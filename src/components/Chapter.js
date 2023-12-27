import React from "react";
import { useState, useEffect } from "react";
import axios from "axios";
import parse from "html-react-parser";
import Title from "./Title";

export default function Chapter(props) {
  const [chapter, setChapter] = useState(null);

  useEffect(() => {
    axios
      .get(
        `https://bolls.life/get-text/${props.translation}/${props.bookNumber}/${props.chapterNumber}/`
      )
      .then((response) => {
        setChapter(response.data);
      });
  }, []);

  if (!chapter) {
    return null;
  }
  return (
    <>
      <Title title="Génesis 1" />
      <article className="px-[15em]">
        {chapter.map((e, id) => (
          <>
            <span
              className="inline leading-8 pl-6 font-extrabold text-cafe"
              key={id}
            >
              <sup>{e.verse}</sup>
            </span>
            <span className="inline text-xl leading-8 pl-1 font-light" key={id}>
              {parse(e.text)}
            </span>
          </>
        ))}
      </article>
    </>
  );
}
