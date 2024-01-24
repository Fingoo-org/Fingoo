type ListItemProps = {
  content: string;
};

export default function ListItem({ content }: ListItemProps) {
  return (
    <li>
      <div className="bg-gray-100 hover:text-blue-700 hover:bg-blue-50 rounded flex p-4 h-full items-center">
        <span className="font-medium">{content}</span>
      </div>
    </li>
  );
}
