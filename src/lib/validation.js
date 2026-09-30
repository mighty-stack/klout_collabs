// Friendly, instant checks in the browser. The server repeats every one of these and is the
// source of truth; its messages are shown next to the same fields if it disagrees.
const REQUIRED = 'This field is required.';

export const clean = (s) => (s ?? '').replace(/\s+/g, ' ').trim();

export const rules = {
  text: (label, min, max) => (v) => {
    const s = clean(v);
    if (!s) return REQUIRED;
    if (s.length < min) return `${label} must be at least ${min} characters.`;
    if (s.length > max) return `${label} must be ${max} characters or fewer.`;
  },
  longText: (label, min, max) => (v) => {
    const s = (v ?? '').trim();
    if (!s) return REQUIRED;
    if (s.length < min) return `${label} must be at least ${min} characters.`;
    if (s.length > max) return `${label} must be ${max} characters or fewer.`;
  },
  optionalLongText: (label, max) => (v) => {
    if ((v ?? '').trim().length > max) return `${label} must be ${max} characters or fewer.`;
  },
  choice: (v) => (v ? undefined : 'Choose an option from the list.'),
  email: (v) => {
    const s = (v ?? '').trim();
    if (!s) return REQUIRED;
    if (s.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(s)) return 'Enter a valid email address.';
  },
  phone: (v) => {
    const s = (v ?? '').replace(/[\s\-().]/g, '');
    if (!s) return REQUIRED;
    if (!/^\+[1-9]\d{7,14}$/.test(s)) return 'Enter the full number with country code, like +234 801 234 5678.';
  },
  website: (v) => {
    const s = (v ?? '').trim();
    if (!s) return undefined;
    try {
      const u = new URL(/^https?:\/\//i.test(s) ? s : `https://${s}`);
      if (!u.hostname.includes('.')) throw new Error();
    } catch {
      return 'Enter a valid website address, like example.com.';
    }
  },
  password: (v) => {
    if (!v) return REQUIRED;
    if (v.length < 8) return 'Use at least 8 characters.';
    if (new TextEncoder().encode(v).length > 72) return 'Use 72 characters or fewer.';
    if (!/[A-Za-z]/.test(v) || !/\d/.test(v)) return 'Include at least one letter and one number.';
  },
  interests: (v) => (v?.length ? undefined : 'Choose at least one collaboration interest.'),
};

export function socialErrors(list) {
  const errors = {};
  if (!list?.length) {
    errors.socials = 'Add at least one social media account.';
    return errors;
  }
  const seen = new Set();
  list.forEach((s, i) => {
    if (!s.platform) errors[`socials.${i}.platform`] = 'Choose a platform.';
    else if (seen.has(s.platform)) errors[`socials.${i}.platform`] = 'Each platform can only be added once.';
    seen.add(s.platform);
    if (!clean(s.handle)) errors[`socials.${i}.handle`] = REQUIRED;
    else if (!/^[A-Za-z0-9._-]{1,50}$/.test(cleanHandle(s.handle)))
      errors[`socials.${i}.handle`] = 'Use letters, numbers, dots, dashes or underscores only.';
    const f = String(s.followers ?? '').trim();
    if (f === '') errors[`socials.${i}.followers`] = REQUIRED;
    else if (!/^\d+$/.test(f)) errors[`socials.${i}.followers`] = 'Enter the number of followers as digits.';
    else if (Number(f) > 1_000_000_000) errors[`socials.${i}.followers`] = 'Enter a realistic follower count.';
  });
  return errors;
}

// Same handle clean-up the server applies: accepts "@name", "name" or a pasted profile URL.
export function cleanHandle(s) {
  let h = (s ?? '').trim();
  if (h.includes('/')) h = h.replace(/\/+$/, '').split('/').pop() || '';
  return h.replace(/^@+/, '').replace(/\?.*$/, '');
}

// Runs { field: ruleFn } against values, returns { field: message } for failures only.
export function runRules(schema, values) {
  const errors = {};
  for (const [field, rule] of Object.entries(schema)) {
    const msg = rule(values[field], values);
    if (msg) errors[field] = msg;
  }
  return errors;
}
