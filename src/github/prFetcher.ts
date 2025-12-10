import { githubClient } from "./githubClient";

export const fetchPRDiff = async (repo: string, prNumber: number) => {
    const [owner, name] = repo.split("/");

    const diff = await githubClient.get(
        `/repos/${owner}/${name}/pulls/${prNumber}`,
        { headers: { Accept: "application/vnd.github.diff" } }
    );

    return diff.data;
};

export const fetchChangedFiles = async (repo: string, prNumber: number) => {
    const [owner, name] = repo.split("/");
    const res = await githubClient.get(
        `/repos/${owner}/${name}/pulls/${prNumber}/files`
    );
    return res.data;
};
