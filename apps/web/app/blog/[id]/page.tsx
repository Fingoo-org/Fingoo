import Link from 'next/link';
import { fetchPostDetail } from '../lib/data';

export default async function Page({ params }: { params: { id: string } }) {
  const post = await fetchPostDetail(params.id);

  const { title, content, updatedAt } = post;

  const date = updatedAt.toISOString().slice(0, 10);

  console.log();

  const contentArray = content.split('\n');
  return (
    <article className="mx-auto max-w-2xl ">
      <div className="flex flex-col items-center justify-center py-16">
        <h2 className="mb-2 text-4xl font-bold">{title}</h2>
        <time className="mt-6 text-xs text-gray-500">{date}</time>
      </div>
      <section className="whitespace-pre-line	">
        {contentArray.map((line, index) => {
          return (
            <p className="py-1" key={index}>
              {line}
            </p>
          );
        })}
      </section>
      <footer>
        <div className="my-12 flex justify-center">
          <Link href="/blog" className="rounded-full border px-4 py-2 text-gray-600 hover:text-gray-900">
            Back to list
          </Link>
        </div>
      </footer>
    </article>
  );
}
