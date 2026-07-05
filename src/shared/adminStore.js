// Admin data-layer: wraps dummyPosts.js (posts) and adminReports.js (flagged
// posts) into the shape the /dashboard admin panel consumes.
import { getPosts, updatePost } from "./dummyPosts";
import { dismissReport, getReports } from "./adminReports";

export { getReports, dismissReport };

export const getAdminStats = () => {
  const posts = getPosts();
  const uniqueEmails = new Set(posts.map((post) => post.email));
  const pendingReports = getReports().filter((report) => report.status === "Pending").length;

  return {
    totalPosts: posts.length,
    activePosts: posts.filter((post) => (post.status || "Active") === "Active").length,
    uniqueUsers: uniqueEmails.size,
    pendingReports,
  };
};

export const getUniqueUsers = () => {
  const usersByEmail = new Map();

  getPosts().forEach((post) => {
    const existing = usersByEmail.get(post.email);
    if (existing) {
      existing.postCount += 1;
      existing.isVerified = existing.isVerified || post.isVerified;
      return;
    }

    usersByEmail.set(post.email, {
      email: post.email,
      name: post.userName,
      image: post.userImage,
      city: post.location,
      isVerified: Boolean(post.isVerified),
      postCount: 1,
    });
  });

  return Array.from(usersByEmail.values()).sort((a, b) => b.postCount - a.postCount);
};

export const featurePost = (id) => updatePost(id, { featurePost: true });

export const updatePostStatus = (id, status) => updatePost(id, { status });
