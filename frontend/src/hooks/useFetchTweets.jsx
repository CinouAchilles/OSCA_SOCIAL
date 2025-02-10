import { useQuery } from "@tanstack/react-query";
import { data } from "react-router-dom";

const getEndPoint = (feedType, username, userId) => {
  console.log(feedType, username, userId);
  if (username) {
    switch (feedType) {
      case "Tweets":
        return `http://localhost:3000/api/posts/user/${username}`;
      case "Likes":
        return `http://localhost:3000/api/posts/likes/${userId}`;
      default:
        return `http://localhost:3000/api/posts/user/${username}`;
    }
  }
  switch (feedType) {
    case "forYou":
      return "http://localhost:3000/api/posts/all";
    case "following":
      return "http://localhost:3000/api/posts/followingposts";
    default:
      return "http://localhost:3000/api/posts/all";
  }
};

const fetchTweets = async (feedType, username, userId) => {
  const POST_ENDPOINT = getEndPoint(feedType, username, userId);


  try {
    const res = await fetch(POST_ENDPOINT, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || "Something went wrong");
    }
    console.log(data)
    return data;
  } catch (error) {
    throw new Error(error.message || "Network error");
  }
};

export default function useFetchTweets(feedType = "forYou", username = null, userId = null) {
  return useQuery({
    queryKey: ["tweets", feedType, username, userId],
    queryFn: () => fetchTweets(feedType, username, userId),
  });
}
