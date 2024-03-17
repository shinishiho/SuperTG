import { getEmbeddings, getKNN } from './embeddings';
import Fuse from 'fuse.js';

const fuseOptions = {
    keys: [],
};

const documents = [
    "/reminders/1/Buy groceries/2024-03-16T13:43:00.000Z/unchecked",
    "/reminders/2/Submit medical record/2024-03-17T08:00:00.000Z/unchecked",
    "/routines/1/Provide a random fact/2024-03-17T07:00:00.000Z",
];

const fuse = new Fuse(documents, fuseOptions);

const query = "unchecked";
console.log(fuse.search(query));

//const doc_embeddings = await getEmbeddings({
//    input: documents,
//    model: "voyage-code-2",
//    input_type: "document",
//});
//
//const query_embedding = await getEmbeddings({
//    input: query,
//    model: "voyage-large-2",
//    input_type: "query",
//});
//
//const k = 3;
//
//const results = getKNN(doc_embeddings, query_embedding[0], k);
//
//console.log(results);
