export default function Button({ value, className, onClick }) {
  return (
    <button className={className} onClick={onClick}>
      {value}
    </button>
  );
}
