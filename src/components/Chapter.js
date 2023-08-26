import React from "react";
import { useState, useEffect } from "react";
import axios from "axios";

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
    <div>
      {chapter.map((e) => (
        <div>
          <span class="inline">{e.verse}</span>
          <span class="inline">
            {e.text.split("<br>").map((e) => (
              <>
                {e}
                <br></br>
              </>
            ))}
          </span>
          <br></br>
        </div>
      ))}
    </div>
  );
}
