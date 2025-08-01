import { Octokit } from "@octokit/rest";

const REPO_OWNER = "Dazhosting";
const REPO_NAME = "View-Kode";
const FILE_PATH = "public/views.json";

const octokit = new Octokit({
  auth: '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', // simpan token di .env.local
});

export default async function handler(req, res) {
  const { slug } = req.query;
  if (!slug) return res.status(400).json({ success: false, message: "Slug required" });

  try {
    // Get file from GitHub
    const { data: fileData } = await octokit.repos.getContent({
      owner: REPO_OWNER,
      repo: REPO_NAME,
      path: FILE_PATH,
    });

    const content = Buffer.from(fileData.content, "base64").toString();
    let views = {};

    try {
      views = JSON.parse(content);
    } catch (e) {
      views = {};
    }

    views[slug] = (views[slug] || 0) + 1;

    const updatedContent = Buffer.from(JSON.stringify(views, null, 2)).toString("base64");

    // Commit updated file back to GitHub
    await octokit.repos.createOrUpdateFileContents({
      owner: REPO_OWNER,
      repo: REPO_NAME,
      path: FILE_PATH,
      message: `🔁 Update view count for ${slug}`,
      content: updatedContent,
      sha: fileData.sha,
    });

    res.status(200).json({ success: true, views: views[slug] });
  } catch (err) {
    console.error("Error updating views:", err.message);
    res.status(500).json({ success: false, message: "Failed to update views" });
  }
      }
