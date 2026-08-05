(function (root, factory) {
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  root.HaticeEnesProgress = api;
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  'use strict';

  const STORAGE_KEY = 'hatice-enes:progress:v1';
  const MAX_STEP = 6;

  function normalize(raw) {
    const source = raw && typeof raw === 'object' ? raw : {};
    const step = Number.isInteger(source.step)
      ? Math.min(Math.max(source.step, 0), MAX_STEP)
      : 0;
    const revealed = Array.isArray(source.revealed)
      ? [...new Set(source.revealed.filter((value) => Number.isInteger(value) && value >= 0 && value < 4))]
      : [];

    return {
      step,
      revealed,
      littleCount: Number.isInteger(source.littleCount) && source.littleCount > 0
        ? Math.min(source.littleCount, 2)
        : 0,
      completed: Boolean(source.completed || step === MAX_STEP)
    };
  }

  function load(storage) {
    if (!storage || typeof storage.getItem !== 'function') return normalize();
    try {
      const value = storage.getItem(STORAGE_KEY);
      return value ? normalize(JSON.parse(value)) : normalize();
    } catch (_error) {
      return normalize();
    }
  }

  function save(storage, state) {
    const normalized = normalize(state);
    if (!storage || typeof storage.setItem !== 'function') return normalized;
    try {
      storage.setItem(STORAGE_KEY, JSON.stringify(normalized));
    } catch (_error) {
      // Private browsing and storage quota errors must not break the experience.
    }
    return normalized;
  }

  function clear(storage) {
    if (!storage || typeof storage.removeItem !== 'function') return;
    try {
      storage.removeItem(STORAGE_KEY);
    } catch (_error) {
      // Reset remains best-effort when storage is unavailable.
    }
  }

  return { STORAGE_KEY, MAX_STEP, normalize, load, save, clear };
});
