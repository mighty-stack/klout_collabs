import { useCallback, useState } from 'react';

// Small form-state helper. Field components take `onChange(value)` (not an event) and an `error`.
export function useForm(initial) {
  const [values, setValues] = useState(initial);
  const [errors, setErrors] = useState({});

  const set = useCallback((name, value) => {
    setValues((v) => ({ ...v, [name]: value }));
    // Editing a field clears its own error (and any nested ones, e.g. socials.0.handle).
    setErrors((e) => {
      const stale = Object.keys(e).filter((k) => k === name || k.startsWith(`${name}.`));
      if (!stale.length) return e;
      const next = { ...e };
      stale.forEach((k) => delete next[k]);
      return next;
    });
  }, []);

  const bind = (name) => ({ name, value: values[name] ?? '', onChange: (v) => set(name, v), error: errors[name] });
  return { values, setValues, errors, setErrors, set, bind };
}

// Moves keyboard focus to the first invalid field so errors are found without hunting.
export function focusFirstError(root = document) {
  requestAnimationFrame(() => {
    const el = root.querySelector('[aria-invalid="true"]');
    if (el) {
      el.focus();
      el.scrollIntoView({ block: 'center', behavior: 'smooth' });
    }
  });
}
