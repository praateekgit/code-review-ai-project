import { githubClient } from "./githubClient";

export const postPRComment = async (
    repo: string,
    prNumber: number,
    body: string
) => {
    const [owner, name] = repo.split("/");

    return githubClient.post(`/repos/${owner}/${name}/issues/${prNumber}/comments`, {
        body,
    });
};
