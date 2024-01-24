type NativeButtonType = React.ComponentPropsWithoutRef<'button'>;

type ButtonProps = NativeButtonType & {};

export default function Button({ children, ...props }: ButtonProps) {
  return (
    <button {...props} className="py-2.5 px-6 rounded-lg text-sm font-medium text-white bg-teal-600">
      {children}
    </button>
  );
}
