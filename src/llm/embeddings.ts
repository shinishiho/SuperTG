import { dot, norm } from 'mathjs';
import axios from 'axios';

interface EmbeddingRequest {
    input: string | string[];
    model: "voyage-2" | "voyage-large-2" | "voyage-code-2";
    input_type: "query" | "document";
    truncation?: boolean;
    encoding_format?: "base64";
}

interface EmbeddingResponseSuccess {
    object: "list";
    data: {
        object: "embedding";
        embedding: number[];
        index: number;
    }[];
    model: "voyage-2" | "voyage-large-2" | "voyage-code-2";
    usage: {
        total_tokens: number;
        prompt_tokens?: number;
        completion_tokens?: number;
    };
};

interface EmbeddingResponseError {
    detail: string;
};

async function getEmbeddings(r: EmbeddingRequest): Promise<number[][]> {
    const config = {
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${process.env.VOYAGE_API_KEY}`,
        },
    };
    return axios.post("https://api.voyageai.com/v1/embeddings", r, config)
    .then((response) => {
        const data = response.data as EmbeddingResponseSuccess;
        return data.data.map((d) => d.embedding);
    })
    .catch((error) => {
        const data = error.response.data as EmbeddingResponseError;
        throw new Error(data.detail);
    });
}

function cosineSimilarity(a: number[], b: number[]): number {
    const dotProduct = dot(a, b);
    const magnitudeA = norm(a) as number;
    const magnitudeB = norm(b) as number;
    return dotProduct / (magnitudeA * magnitudeB);
}

function getKNN(
    embeddings: number[][],
    query: number[],
    k: number
): { index: number; similarity: number }[] {
    const similarities = embeddings.map((embedding, index) => ({
        index,
        similarity: cosineSimilarity(embedding, query),
    }));
    return similarities
    .sort((a, b) => b.similarity - a.similarity)
    .slice(0, k);
}

export { getEmbeddings, getKNN };
