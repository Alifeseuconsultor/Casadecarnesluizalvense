type GramsInputProps = {
  id?: string;
  value: string;
  onChange: (value: string) => void;
  ariaLabel: string;
  testId: string;
  className?: string;
  disabled?: boolean;
  placeholder?: string;
  onBlur?: () => void;
};

export function GramsInput({
  id,
  value,
  onChange,
  ariaLabel,
  testId,
  className = "",
  disabled = false,
  placeholder = "0",
  onBlur,
}: GramsInputProps) {
  const grams = Number(value);

  return (
    <div className={`grams-input ${className}`}>
      <input
        id={id}
        type="text"
        inputMode="numeric"
        pattern="[0-9]*"
        autoComplete="off"
        aria-label={ariaLabel}
        value={value}
        placeholder={placeholder}
        disabled={disabled}
        onBlur={onBlur}
        onFocus={(event) => {
          if (value === "0") event.currentTarget.select();
        }}
        onChange={(event) => {
          onChange(event.target.value.replace(/\D/g, ""));
        }}
        data-testid={testId}
      />
      <span>g</span>
      {Number.isFinite(grams) && grams >= 1000 && (
        <small>
          {(grams / 1000).toLocaleString("pt-BR", { maximumFractionDigits: 3 })} kg
        </small>
      )}
    </div>
  );
}
