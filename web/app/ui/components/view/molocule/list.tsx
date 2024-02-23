type ListProps<T> = {
  list: T[];
  render: (item: T) => JSX.Element;
};

export default function List<T>({ list, render }: ListProps<T>) {
  return <div className="flex flex-col divide-y divide-gray-200 bg-gray-100">{list.map((item) => render(item))}</div>;
}
