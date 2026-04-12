/** @type {import('next').NextConfig} */
const repositoryName = process.env.GITHUB_REPOSITORY?.split("/")[1] ?? ""
const isGitHubActions = process.env.GITHUB_ACTIONS === "true"
const isUserOrOrgPagesSite = repositoryName.endsWith(".github.io")
const basePath =
  isGitHubActions && repositoryName && !isUserOrOrgPagesSite
    ? `/${repositoryName}`
    : ""

const nextConfig = {
  output: "export",
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
  basePath,
  assetPrefix: basePath ? `${basePath}/` : undefined,
}

export default nextConfig
