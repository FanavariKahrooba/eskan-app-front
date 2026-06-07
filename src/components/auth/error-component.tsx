export default function ErrorComponent({ text }: { text: string }) {
  return (
    <>
      <p className=" text-red-500 hover:text-red-600 text-xs mt-2">{text}</p>
    </>
  );
}
