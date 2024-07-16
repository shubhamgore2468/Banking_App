export function InputBox({ label, placeholder, onChange }) {
  return (
    <div>
      <div className="py-2 font-medium text-left">{label}</div>
      <input
        className="border border-slate-300 rounded-lg px-4 py-2 w-full"
        placeholder={placeholder}
        onChange={onChange}
      />
    </div>
  );
}
