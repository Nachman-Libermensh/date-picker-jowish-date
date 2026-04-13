const FALLBACK_SITE_URL =
  "https://nachman-libermensh.github.io/date-picker-jowish-date"

function trimTrailingSlash(url: string) {
  return url.replace(/\/+$/, "")
}

function getGitHubPagesUrl() {
  const repository = process.env.GITHUB_REPOSITORY

  if (!repository) {
    return undefined
  }

  const [owner, repositoryName] = repository.split("/")

  if (!owner || !repositoryName) {
    return undefined
  }

  if (repositoryName.endsWith(".github.io")) {
    return `https://${repositoryName.toLowerCase()}`
  }

  return `https://${owner.toLowerCase()}.github.io/${repositoryName}`
}

export function getSiteUrl() {
  const fromEnv = process.env.NEXT_PUBLIC_SITE_URL

  if (fromEnv) {
    return trimTrailingSlash(fromEnv)
  }

  const fromGitHubPages = getGitHubPagesUrl()

  if (fromGitHubPages) {
    return trimTrailingSlash(fromGitHubPages)
  }

  return FALLBACK_SITE_URL
}

export function getAbsoluteUrl(path = "/") {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`

  if (normalizedPath === "/") {
    return `${getSiteUrl()}/`
  }

  return `${getSiteUrl()}${normalizedPath}`
}

export function getCanonicalRoute(path = "/") {
  const absoluteUrl = getAbsoluteUrl(path)

  return absoluteUrl.endsWith("/") ? absoluteUrl : `${absoluteUrl}/`
}
