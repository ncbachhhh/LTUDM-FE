import { useCallback, useEffect, useState } from "react";

export function useFriendSearch({
  searchFn,
  enabled = true,
  auto = false,
  minLength = 2,
  debounceMs = 250,
  emptyMessage = "Không tìm thấy kết quả phù hợp.",
  minLengthMessage = "Nhập ít nhất 2 ký tự để tìm kiếm.",
}) {
  const [keyword, setKeyword] = useState("");
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const clear = useCallback(() => {
    setKeyword("");
    setResults(null);
    setMessage("");
    setLoading(false);
  }, []);

  const search = useCallback(
    async (rawKeyword = keyword) => {
      const normalizedKeyword = rawKeyword.trim();

      if (!enabled) return null;

      if (normalizedKeyword.length < minLength) {
        setResults(null);
        setMessage(auto ? "" : minLengthMessage);
        return null;
      }

      setLoading(true);
      setMessage("");

      const response = await searchFn(normalizedKeyword);
      setLoading(false);

      if (!response.isSuccess) {
        setResults([]);
        setMessage(response.message);
        return response;
      }

      const data = response.data || [];
      setResults(data);
      setMessage(data.length ? "" : emptyMessage);
      return response;
    },
    [auto, emptyMessage, enabled, keyword, minLength, minLengthMessage, searchFn]
  );

  useEffect(() => {
    if (!auto || !enabled) return undefined;

    const timerId = window.setTimeout(() => {
      search(keyword);
    }, debounceMs);

    return () => window.clearTimeout(timerId);
  }, [auto, debounceMs, enabled, keyword, search]);

  return {
    keyword,
    setKeyword,
    results,
    loading,
    message,
    search,
    clear,
    setMessage,
    setResults,
  };
}
