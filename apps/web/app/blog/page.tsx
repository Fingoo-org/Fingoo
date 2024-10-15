import Link from 'next/link';
import { fetchPosts } from './lib/data';
import { CalendarIcon } from 'lucide-react';

export default async function Page() {
  const posts = await fetchPosts();

  return (
    <>
      <div className="mx-auto max-w-2xl ">
        <div className="flex flex-col items-center justify-center pb-28 pt-20">
          <h2 className="mb-2 text-4xl font-bold">FINGOO 블로그</h2>
        </div>
        {posts.map((post) => (
          <Link key={post.id} href={`/blog/${post.id}`}>
            <BlogPostItem title={post.title} date={post.updatedAt.toISOString().slice(0, 10)} preview={post.preview} />
          </Link>
        ))}
      </div>
    </>
  );
}

interface BlogPostProps {
  title: string;
  date: string;
  preview: string;
}

function BlogPostItem({ title, date, preview }: BlogPostProps) {
  return (
    <article className="mb-8 border-b border-gray-200 pb-8">
      <h2 className="mb-2 text-2xl font-bold">{title}</h2>
      <div className="mb-4 flex items-center text-sm text-gray-500">
        <CalendarIcon className="mr-2 h-4 w-4" />
        <time dateTime={date}>{date}</time>
      </div>
      <p className="line-clamp-3 text-ellipsis text-sm leading-7 text-gray-600">{preview}</p>
    </article>
  );
}
