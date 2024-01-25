type ListProps<T> = {
  list: T[];
  render: (item: T) => JSX.Element;
};

export default function List<T>({ list, render }: ListProps<T>) {
  return <ul className="divide-y divide-gray-200">{list.map((item) => render(item))}</ul>;
}
