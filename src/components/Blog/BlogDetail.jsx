import { useParams, useNavigate } from "react-router-dom";
import { useBlogDetail } from "../../hooks/useBlogs";
import LexicalContentViewer from "./LexicalContentViewer";
import AuthGate from "./AuthGate";
import "./blog-detail.css";

const CalendarIcon = () => (
  <svg
    className="w-4 h-4 mr-2"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
    />
  </svg>
);

const UserIcon = () => (
  <svg
    className="w-4 h-4 mr-2"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
    />
  </svg>
);

const CategoryIcon = () => (
  <svg
    className="w-4 h-4 mr-2"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
    />
  </svg>
);

const BlogDetail = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { blog, loading, error, requireAuth } = useBlogDetail(slug);

  // If auth is required, show gate
  if (requireAuth) {
    return <AuthGate />;
  }

  // Loading state
  if (loading) {
    return (
      <div className="w-full min-h-screen bg-[#FDFCF8] px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl border-2 border-black p-8 text-center">
            <p className="text-stone-700 font-medium">Loading article…</p>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="w-full min-h-screen bg-[#FDFCF8] px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="bg-[#FCD34D] rounded-2xl border-2 border-black p-8 text-center">
            <p className="text-stone-900 font-bold">{error}</p>
            <button
              onClick={() => navigate("/blog")}
              className="mt-4 bg-stone-900 text-white px-6 py-2 rounded-lg font-bold border-2 border-black hover:bg-stone-800 transition"
            >
              Back to Blog
            </button>
          </div>
        </div>
      </div>
    );
  }

  // No blog found
  if (!blog) {
    return (
      <div className="w-full min-h-screen bg-[#FDFCF8] px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl border-2 border-black p-8 text-center">
            <p className="text-stone-700 font-medium">Article not found</p>
            <button
              onClick={() => navigate("/blog")}
              className="mt-4 bg-emerald-600 text-white px-6 py-2 rounded-lg font-bold border-2 border-black hover:bg-emerald-700 transition"
            >
              Back to Blog
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Format author name
  const authorName = blog?.author
    ? [blog.author.firstname, blog.author.lastname].filter(Boolean).join(" ")
    : "Unknown";

  // Format date
  const createdAt = blog?.createdAt ? new Date(blog.createdAt) : null;
  const displayDate = createdAt
    ? createdAt.toLocaleDateString(undefined, {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "";

  return (
    <div className="w-full min-h-screen bg-[#FDFCF8] px-4 py-12 md:py-20">
      <div className="max-w-4xl mx-auto">
        {/* Back Button */}
        <button
          onClick={() => navigate("/blog")}
          className="mb-8 inline-flex items-center text-emerald-600 hover:text-emerald-700 font-bold transition"
        >
          <svg
            className="w-5 h-5 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M15 19l-7-7 7-7"
            />
          </svg>
          Back to Articles
        </button>

        {/* Cover Image */}
        {blog.coverImage && (
          <div className="mb-8 rounded-[2rem] border-4 border-black overflow-hidden">
            <img
              src={blog.coverImage}
              alt={blog.title}
              className="w-full h-96 object-cover"
            />
          </div>
        )}

        {/* Category Badge */}
        {blog.category && (
          <div className="mb-4">
            <span className="inline-block px-4 py-1.5 rounded-full bg-[#FCD34D] border-2 border-black text-stone-900 text-xs font-bold uppercase tracking-wider">
              {blog.category}
            </span>
          </div>
        )}

        {/* Title */}
        <h1 className="text-4xl md:text-6xl font-bold text-stone-800 font-serif mb-6 leading-tight">
          {blog.title}
        </h1>

        {/* Author, Date, Category Meta */}
        <div className="flex flex-wrap items-center gap-6 mb-12 pb-8 border-b-2 border-stone-300">
          <div className="flex items-center text-sm font-bold text-stone-600">
            <UserIcon />
            <span className="text-stone-800">{authorName}</span>
          </div>
          <div className="flex items-center text-sm font-bold text-stone-600">
            <CalendarIcon />
            <span className="text-stone-800">{displayDate}</span>
          </div>
          {blog.category && (
            <div className="flex items-center text-sm font-bold text-stone-600">
              <CategoryIcon />
              <span className="text-stone-800">{blog.category}</span>
            </div>
          )}
        </div>

        {/* Author Info Card */}
        {blog.author && (
          <div className="mb-12 bg-white rounded-2xl border-2 border-black p-6 flex items-center gap-4">
            {blog.author.userpic && (
              <img
                src={blog.author.userpic}
                alt={authorName}
                className="w-16 h-16 rounded-full border-2 border-black object-cover"
              />
            )}
            <div>
              <p className="font-bold text-stone-900">{authorName}</p>
              <p className="text-sm text-stone-500">Author</p>
            </div>
          </div>
        )}

        {/* Blog Content */}
        {blog.content && (
          <div className="blog-detail-content mb-12">
            <LexicalContentViewer content={blog.content} />
          </div>
        )}

        {/* Related/Back Section */}
        <div className="mt-12 pt-8 border-t-2 border-stone-300 text-center">
          <button
            onClick={() => navigate("/blog")}
            className="inline-block bg-emerald-600 text-white px-8 py-3 rounded-xl font-bold border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all"
          >
            Back to All Articles
          </button>
        </div>
      </div>
    </div>
  );
};

export default BlogDetail;
