import { Database } from '@/app/api/blog/data';
import { createKysely } from '@vercel/postgres-kysely';

const db = createKysely<Database>();

type PreviewPost = {
  id: string;
  title: string;
  preview: string;
  updatedAt: Date;
};

export async function fetchPosts() {
  const posts = await db.selectFrom('post').select(['id', 'title', 'content', 'updatedAt']).execute();

  const postsWithPreview: PreviewPost[] = posts.map((post) => {
    const postWithoutContent = { ...post, content: undefined };

    return {
      ...postWithoutContent,
      preview: post.content.slice(0, 300),
    };
  });

  return postsWithPreview;
}

export async function fetchPostDetail(id: string) {
  const post = await db
    .selectFrom('post')
    .select(['id', 'title', 'content', 'updatedAt'])
    .where('id', '=', id)
    .execute();

  console.log(post);

  return post[0];
}
