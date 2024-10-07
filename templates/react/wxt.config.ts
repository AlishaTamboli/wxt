module.exports = {
  name: "LinkedIn Auto Connect",
  entrypoints: {
    contentScript: "./src/ContentScript.js", // Path to your main content script
  },
  manifest: {
    permissions: ["tabs", "activeTab"],
    content_scripts: [
      {
        matches: ["https://www.linkedin.com/mynetwork/grow/*"], // LinkedIn network grow page
        js: ["./public/content.js"],
      },
    ],
  },
};
