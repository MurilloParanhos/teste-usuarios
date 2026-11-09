interface Props {
  value: string;
  onChange: (value: string) => void;
}

export function SearchBar({ value, onChange }: Props) {
  return (
    <input
      type="text"
      placeholder="Buscar pelo nome..."
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
  );
}