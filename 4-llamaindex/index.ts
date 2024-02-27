import fs from "node:fs/promises";
import {
  Document,
  Groq,
  VectorStoreIndex,
  serviceContextFromDefaults,
} from "llamaindex";
async function main() {
  const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY,
  });
  const serviceContext = serviceContextFromDefaults({ llm: groq });
  const path = "node_modules/llamaindex/examples/abramov.txt";
  const essay = await fs.readFile(path, "utf-8");
  const document = new Document({ text: essay, id_: "essay" });
  const index = await VectorStoreIndex.fromDocuments([document], {
    serviceContext,
  });
  const retriever = index.asRetriever();
  const queryEngine = index.asQueryEngine({
    retriever,
  });
  const query = "What is the meaning of life?";
  const response = await queryEngine.query({
    query,
  });
  console.log(response.response);
}
await main();