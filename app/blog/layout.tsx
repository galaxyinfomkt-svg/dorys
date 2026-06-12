// Loads blog.css for /blog and /blog/[slug]. blog.css holds the article-header,
// prose, blog-card and share-button styles but was never wired into the Next
// migration — so blog pages rendered with oversized meta icons and unstyled
// article chrome. Scoped here (not the root layout) so the other ~1,800 pages
// don't pay for blog-only CSS. Bump the ?v= when blog.css changes.
export default function BlogLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <link rel="stylesheet" href="/assets/css/blog.css?v=20260612a" />
      {children}
    </>
  )
}
