import { useEffect, useState } from "react";
import axios from "axios";

const BACKEND_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";
const API_URL = `${BACKEND_URL}/api/url`;
const SHORT_URL_BASE = BACKEND_URL;

function App() {
  const [urls, setUrls] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [currentUrl, setCurrentUrl] = useState(null);

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [deletingId, setDeletingId] = useState(null);
  const [copiedCode, setCopiedCode] = useState(null);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Fetch all URLs
  async function fetchUrls() {
    try {
      setFetching(true);
      setError("");

      const response = await axios.get(API_URL);
      setUrls(response.data?.data?.urls || []);
    } catch (err) {
      console.error("Fetch URLs Error:", err);
      setError("Unable to load URLs. Please check your backend server.");
    } finally {
      setFetching(false);
    }
  }

  // Create short URL
  async function createShortUrl(e) {
    e.preventDefault();

    const trimmedUrl = inputValue.trim();

    if (!trimmedUrl) {
      setError("Please enter a URL.");
      return;
    }

    try {
      new URL(trimmedUrl);
    } catch {
      setError("Please enter a valid URL.");
      return;
    }

    try {
      setLoading(true);
      setError("");
      setSuccess("");
      setCurrentUrl(null);

      const response = await axios.post(API_URL, {
        url: trimmedUrl,
      });

      const newUrl = response.data?.data;

      setCurrentUrl({
        originalUrl: newUrl.originalUrl,
        shortCode: newUrl.shortCode,
      });

      setInputValue("");
      setSuccess("Short URL created successfully!");

      await fetchUrls();
    } catch (err) {
      console.error("Create URL Error:", err);
      setError(
        err.response?.data?.message ||
          "Something went wrong while creating the short URL."
      );
    } finally {
      setLoading(false);
    }
  }

  // Delete URL
  async function deleteUrl(id) {
    try {
      setDeletingId(id);
      setError("");
      setSuccess("");

      await axios.delete(`${API_URL}/${id}`);

      setUrls((prevUrls) => prevUrls.filter((url) => url._id !== id));
      setSuccess("URL deleted successfully.");
    } catch (err) {
      console.error("Delete URL Error:", err);
      setError(
        err.response?.data?.message ||
          "Unable to delete the URL. Please try again."
      );
    } finally {
      setDeletingId(null);
    }
  }

  // Copy short URL
  async function copyShortUrl(shortCode) {
    const shortUrl = `${SHORT_URL_BASE}/${shortCode}`;

    try {
      await navigator.clipboard.writeText(shortUrl);

      setCopiedCode(shortCode);
      setSuccess("Short URL copied to clipboard!");

      setTimeout(() => {
        setCopiedCode(null);
      }, 2000);
    } catch (err) {
      console.error("Copy Error:", err);
      setError("Unable to copy URL.");
    }
  }

  // Fetch URLs when component loads and refresh automatically
  useEffect(() => {
    fetchUrls();

    const interval = setInterval(() => {
      fetchUrls();
    }, 120000);

    const handleFocus = () => fetchUrls();

    window.addEventListener("focus", handleFocus);

    return () => {
      clearInterval(interval);
      window.removeEventListener("focus", handleFocus);
    };
  }, []);

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <div className="absolute inset-0-z-0 overflow-hidden">
        <div className="absolute left-1/4 top-0 h-72 w-72 rounded-full bg-orange-500/10 blur-3xl" />
        <div className="absolute right-1/4 top-1/3 h-72 w-72 rounded-full bg-blue-500/10 blur-3xl" />
      </div>

      <div className="relative z-10 mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        <header className="mb-10 text-center">
          <div className="mb-4 inline-flex items-center rounded-full border border-orange-500/20 bg-orange-500/10 px-4 py-2 text-sm font-medium text-orange-400">
            URL Shortener
          </div>

          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
            Make your URLs
            <span className="text-orange-500"> shorter.</span>
          </h1>

          <p className="mx-auto mt-4 max-w-2xl text-sm leading-6 text-slate-400 sm:text-base">
            Create short, clean and shareable links in seconds. Track clicks
            and manage all your shortened URLs from one place.
          </p>
        </header>

        <section className="mx-auto max-w-4xl">
          <form
            onSubmit={createShortUrl}
            className="rounded-2xl border border-slate-800 bg-slate-900/80 p-3 shadow-2xl shadow-black/20 backdrop-blur"
          >
            <div className="flex flex-col gap-3 sm:flex-row">
              <div className="relative flex-1">
                <input
                  type="url"
                  placeholder="https://example.com/your-long-url"
                  value={inputValue}
                  onChange={(e) => {
                    setInputValue(e.target.value);
                    setError("");
                  }}
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3.5 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="rounded-xl bg-orange-500 px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500/40 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? "Creating..." : "Shorten URL"}
              </button>
            </div>
          </form>

          {error && (
            <div className="mt-4 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
              {error}
            </div>
          )}

          {success && !error && (
            <div className="mt-4 rounded-xl border border-green-500/20 bg-green-500/10 px-4 py-3 text-sm text-green-400">
              {success}
            </div>
          )}
        </section>

        {currentUrl && (
          <section className="mx-auto mt-6 max-w-4xl">
            <div className="rounded-2xl border border-orange-500/20 bg-orange-500/5 p-5">
              <div className="mb-3 flex items-center justify-between">
                <h2 className="font-semibold text-white">
                  Your short URL is ready 🎉
                </h2>

                <button
                  onClick={() => copyShortUrl(currentUrl.shortCode)}
                  className="text-sm font-medium text-orange-400 transition hover:text-orange-300"
                >
                  {copiedCode === currentUrl.shortCode ? "Copied!" : "Copy"}
                </button>
              </div>

              <a
                href={`${SHORT_URL_BASE}/${currentUrl.shortCode}`}
                target="_blank"
                rel="noreferrer"
                className="break-all text-lg font-semibold text-orange-400 hover:text-orange-300"
              >
                {SHORT_URL_BASE}/{currentUrl.shortCode}
              </a>

              <p className="mt-2 truncate text-sm text-slate-500">
                {currentUrl.originalUrl}
              </p>
            </div>
          </section>
        )}

        <section className="mx-auto mt-10 grid max-w-4xl grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5">
            <p className="text-sm text-slate-500">Total URLs</p>
            <p className="mt-2 text-3xl font-bold">{urls.length}</p>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5">
            <p className="text-sm text-slate-500">Total Clicks</p>
            <p className="mt-2 text-3xl font-bold">
              {urls.reduce((total, url) => total + (url.clicks || 0), 0)}
            </p>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5">
            <p className="text-sm text-slate-500">Status</p>
            <p className="mt-2 text-lg font-semibold text-green-400">
              {fetching ? "Loading..." : "System Active"}
            </p>
          </div>
        </section>

        <section className="mx-auto mt-10 max-w-4xl">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold">Your URLs</h2>
              <p className="mt-1 text-sm text-slate-500">
                Manage your shortened links
              </p>
            </div>

            <button
              onClick={fetchUrls}
              disabled={fetching}
              className="rounded-lg border border-slate-700 px-3 py-2 text-sm text-slate-300 transition hover:border-slate-600 hover:bg-slate-800 disabled:opacity-50"
            >
              {fetching ? "Refreshing..." : "Refresh"}
            </button>
          </div>

          {fetching && (
            <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-10 text-center">
              <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-2 border-slate-700 border-t-orange-500" />
              <p className="text-sm text-slate-400">Loading your URLs...</p>
            </div>
          )}

          {!fetching && urls.length === 0 && (
            <div className="rounded-2xl border border-dashed border-slate-700 bg-slate-900/50 p-12 text-center">
              <div className="mb-4 text-4xl">🔗</div>
              <h3 className="font-semibold text-white">
                No shortened URLs yet
              </h3>
              <p className="mt-2 text-sm text-slate-500">
                Enter a long URL above to create your first short link.
              </p>
            </div>
          )}

          {!fetching && urls.length > 0 && (
            <div className="space-y-3">
              {urls.map((url) => {
                const shortUrl = `${SHORT_URL_BASE}/${url.shortCode}`;

                return (
                  <div
                    key={url._id}
                    className="group rounded-2xl border border-slate-800 bg-slate-900/70 p-4 transition hover:border-slate-700 hover:bg-slate-900"
                  >
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
                      <div className="min-w-32">
                        <p className="mb-1 text-xs uppercase tracking-wider text-slate-600">
                          Short code
                        </p>

                        <a
                          href={shortUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="font-semibold text-orange-400 transition hover:text-orange-300"
                        >
                          /{url.shortCode}
                        </a>
                      </div>

                      <div className="min-w-0 flex-1">
                        <p className="mb-1 text-xs uppercase tracking-wider text-slate-600">
                          Original URL
                        </p>

                        <p
                          title={url.originalUrl}
                          className="truncate text-sm text-slate-400"
                        >
                          {url.originalUrl}
                        </p>
                      </div>

                      <div className="min-w-20">
                        <p className="mb-1 text-xs uppercase tracking-wider text-slate-600">
                          Clicks
                        </p>

                        <p className="font-semibold text-white">
                          {url.clicks || 0}
                        </p>
                      </div>

                      <div className="flex gap-2">
                        <button
                          onClick={() => copyShortUrl(url.shortCode)}
                          className="rounded-lg border border-slate-700 px-3 py-2 text-xs font-medium text-slate-300 transition hover:border-orange-500/50 hover:bg-orange-500/10 hover:text-orange-400"
                        >
                          {copiedCode === url.shortCode ? "Copied!" : "Copy"}
                        </button>

                        <button
                          onClick={() => deleteUrl(url._id)}
                          disabled={deletingId === url._id}
                          className="rounded-lg border border-red-500/20 px-3 py-2 text-xs font-medium text-red-400 transition hover:bg-red-500/10 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          {deletingId === url._id ? "Deleting..." : "Delete"}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>

        <footer className="mt-16 border-t border-slate-800 pt-6 text-center">
          <p className="text-xs text-slate-600">
            URL Shortener • Built with React, Tailwind CSS & Node.js
          </p>
        </footer>
      </div>
    </main>
  );
}

export default App;