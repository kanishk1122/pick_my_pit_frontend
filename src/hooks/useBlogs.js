import { useEffect, useMemo } from "react";
import { useAppDispatch, useAppSelector } from "../store";
import { fetchBlogs, fetchBlogBySlug } from "../store/slices/blogSlice";

// Extract plain text from Lexical JSON content (best-effort)
const extractText = (contentObj) => {
  try {
    if (!contentObj || typeof contentObj !== "object") return "";
    const traverse = (node) => {
      if (!node) return "";
      if (Array.isArray(node)) return node.map(traverse).join(" ");
      const text = node.text || "";
      const children = node.children || node.__children || [];
      return [text, traverse(children)].filter(Boolean).join(" ");
    };
    const root = contentObj.root || contentObj;
    const raw = traverse(root);
    return raw.replace(/\s+/g, " ").trim();
  } catch (_) {
    return "";
  }
};

export const useBlogs = (options = { page: 1, limit: 12 }) => {
  const dispatch = useAppDispatch();
  const { list, status, error } = useAppSelector((s) => s.blogs || {});

  useEffect(() => {
    dispatch(fetchBlogs(options));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [options.page, options.limit]);

  const posts = useMemo(() => {
    const mapped = (Array.isArray(list) ? list : []).map((b, idx) => {
      const authorName = b?.author
        ? [b.author.firstname, b.author.lastname].filter(Boolean).join(" ")
        : "";
      const text = extractText(b?.content);
      const excerpt = text
        ? text.slice(0, 180) + (text.length > 180 ? "…" : "")
        : "";
      const createdAt = b?.createdAt ? new Date(b.createdAt) : null;
      const displayDate = createdAt
        ? createdAt.toLocaleDateString(undefined, {
            month: "short",
            day: "2-digit",
            year: "numeric",
          })
        : "";
      return {
        id: b?.slug || b?._id,
        title: b?.title || "",
        excerpt,
        category: b?.category || "",
        author: authorName || "",
        date: displayDate,
        image: b?.coverImage || "",
        featured: idx === 0,
      };
    });
    return mapped;
  }, [list]);

  const categories = useMemo(() => {
    const set = new Set(posts.map((p) => p.category).filter(Boolean));
    return ["All", ...Array.from(set)];
  }, [posts]);

  return {
    posts,
    categories,
    loading: status === "loading",
    error,
    reload: () => dispatch(fetchBlogs(options)),
  };
};

export const useBlogDetail = (slug) => {
  const dispatch = useAppDispatch();
  const { detail, detailStatus, detailError } = useAppSelector(
    (s) => s.blogs || {}
  );

  useEffect(() => {
    if (slug) {
      dispatch(fetchBlogBySlug({ slug }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug]);

  return {
    blog: detail,
    loading: detailStatus === "loading",
    error: detailError,
    requireAuth: detailError === "Authentication required to read full article",
  };
};

export default useBlogs;
