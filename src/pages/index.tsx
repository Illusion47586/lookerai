import { useState } from "react";
import axios from "axios";

export default function Home() {
  const [query, setQuery] = useState<string>();
  const [gptResponse, setGptResponse] = useState<string>();

  return (
    <main>
      <h1>LookerGPT</h1>
      <form
        onSubmit={async (e) => {
          e.preventDefault();
          const response = await axios.get("/api/gpt", { params: { query } });
          if (response.status >= 200 && response.status <= 300) {
            setGptResponse(response.data.reply);
          } else setGptResponse(response.statusText);
        }}
      >
        <input
          type="text"
          title="Query"
          value={query}
          onChange={(v) => setQuery(v.currentTarget.value)}
          placeholder="What are you looking for?"
        />
        <button type="submit">generate url</button>
      </form>
      {gptResponse && (
        <div className="response">
          <p>{gptResponse}</p>
          <button
            onClick={() => {
              const expression =
                /[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)?/gi;
              const regex = new RegExp(expression);
              const url = gptResponse.match(regex)?.[0];
              window.open(url, "_blank");
            }}
          >
            Open
          </button>
        </div>
      )}
    </main>
  );
}
