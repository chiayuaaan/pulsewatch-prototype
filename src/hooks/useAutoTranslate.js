import { useEffect, useRef, useState } from 'react';

const CACHE_KEY = 'pulsewatch-khmer-ui-v1';
const TRANSLATABLE_ATTRIBUTES = ['placeholder', 'title', 'aria-label'];
const BLOCKED_TAGS = new Set(['SCRIPT', 'STYLE', 'NOSCRIPT', 'TEXTAREA', 'OPTION', 'CODE', 'PRE']);

function loadCache() {
  try {
    return JSON.parse(window.localStorage.getItem(CACHE_KEY) || '{}');
  } catch {
    return {};
  }
}

function saveCache(cache) {
  try {
    window.localStorage.setItem(CACHE_KEY, JSON.stringify(cache));
  } catch {
    // Translation still works when private browsing blocks local storage.
  }
}

function shouldTranslate(value) {
  const text = value?.trim();
  if (!text || text.length < 2) return false;
  if (/^(?:https?:\/\/|www\.)/i.test(text)) return false;
  if (!/[A-Za-z]/.test(text)) return false;
  return true;
}

function isBlocked(element) {
  return !element
    || BLOCKED_TAGS.has(element.tagName)
    || Boolean(element.closest('[data-no-translate]'));
}

function withOriginalSpacing(original, translated) {
  const leading = original.match(/^\s*/)?.[0] ?? '';
  const trailing = original.match(/\s*$/)?.[0] ?? '';
  return `${leading}${translated}${trailing}`;
}

function chunkTexts(texts, maxItems = 48, maxCharacters = 7000) {
  const chunks = [];
  let current = [];
  let characters = 0;

  texts.forEach((text) => {
    if (current.length && (current.length >= maxItems || characters + text.length > maxCharacters)) {
      chunks.push(current);
      current = [];
      characters = 0;
    }
    current.push(text);
    characters += text.length;
  });

  if (current.length) chunks.push(current);
  return chunks;
}

export default function useAutoTranslate(rootRef, language, pageKey) {
  const [status, setStatus] = useState('idle');
  const cacheRef = useRef(null);
  const originalTextRef = useRef(new WeakMap());
  const originalAttributeRef = useRef(new WeakMap());
  const trackedTextRef = useRef(new Set());
  const trackedElementRef = useRef(new Set());

  if (cacheRef.current === null && typeof window !== 'undefined') {
    cacheRef.current = loadCache();
  }

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return undefined;

    let active = true;
    let observer;
    let scheduleId;
    let requestVersion = 0;

    const restoreEnglish = () => {
      trackedTextRef.current.forEach((node) => {
        const original = originalTextRef.current.get(node);
        if (node.isConnected && original !== undefined) node.nodeValue = original;
      });

      trackedElementRef.current.forEach((element) => {
        const originals = originalAttributeRef.current.get(element);
        if (!element.isConnected || !originals) return;
        Object.entries(originals).forEach(([attribute, value]) => element.setAttribute(attribute, value));
      });
    };

    if (language !== 'kh') {
      restoreEnglish();
      setStatus('idle');
      return undefined;
    }

    const collectTargets = () => {
      const targets = new Map();
      const addTarget = (text, apply) => {
        const key = text.trim();
        if (!shouldTranslate(key)) return;
        if (!targets.has(key)) targets.set(key, []);
        targets.get(key).push(apply);
      };

      const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
      let node = walker.nextNode();
      while (node) {
        const element = node.parentElement;
        if (!isBlocked(element)) {
          if (!originalTextRef.current.has(node)) {
            originalTextRef.current.set(node, node.nodeValue);
            trackedTextRef.current.add(node);
          }
          const original = originalTextRef.current.get(node);
          addTarget(original, (translation) => {
            const nextValue = withOriginalSpacing(original, translation);
            if (node.nodeValue !== nextValue) node.nodeValue = nextValue;
          });
        }
        node = walker.nextNode();
      }

      root.querySelectorAll('[placeholder], [title], [aria-label]').forEach((element) => {
        if (isBlocked(element)) return;
        let originals = originalAttributeRef.current.get(element);
        if (!originals) {
          originals = {};
          originalAttributeRef.current.set(element, originals);
          trackedElementRef.current.add(element);
        }

        TRANSLATABLE_ATTRIBUTES.forEach((attribute) => {
          if (!element.hasAttribute(attribute)) return;
          if (!(attribute in originals)) originals[attribute] = element.getAttribute(attribute);
          const original = originals[attribute];
          addTarget(original, (translation) => {
            if (element.getAttribute(attribute) !== translation) element.setAttribute(attribute, translation);
          });
        });
      });

      return targets;
    };

    const applyKnownTranslations = (targets) => {
      targets.forEach((applyFunctions, text) => {
        const translation = cacheRef.current[text];
        if (!translation) return;
        applyFunctions.forEach((apply) => apply(translation));
      });
    };

    const translatePage = async () => {
      if (!active) return;
      const version = ++requestVersion;
      const targets = collectTargets();
      applyKnownTranslations(targets);
      const missing = [...targets.keys()].filter((text) => !cacheRef.current[text]);

      if (!missing.length) {
        setStatus('ready');
        return;
      }

      setStatus('loading');
      try {
        for (const texts of chunkTexts(missing)) {
          const response = await fetch('/api/translate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ texts, targetLanguage: 'km' }),
          });

          if (!response.ok) throw new Error(`Translation service returned ${response.status}`);
          const payload = await response.json();
          if (!Array.isArray(payload.translations) || payload.translations.length !== texts.length) {
            throw new Error('Translation service returned an invalid response');
          }

          texts.forEach((text, index) => {
            const translation = payload.translations[index]?.trim();
            if (translation) cacheRef.current[text] = translation;
          });
          saveCache(cacheRef.current);
        }

        if (!active || version !== requestVersion) return;
        applyKnownTranslations(collectTargets());
        setStatus('ready');
      } catch {
        if (active && version === requestVersion) setStatus('unavailable');
      }
    };

    const scheduleTranslation = () => {
      window.clearTimeout(scheduleId);
      scheduleId = window.setTimeout(translatePage, 80);
    };

    observer = new MutationObserver(scheduleTranslation);
    observer.observe(root, {
      childList: true,
      subtree: true,
      characterData: true,
      attributes: true,
      attributeFilter: TRANSLATABLE_ATTRIBUTES,
    });
    translatePage();

    return () => {
      active = false;
      requestVersion += 1;
      window.clearTimeout(scheduleId);
      observer?.disconnect();
      restoreEnglish();
    };
  }, [language, pageKey, rootRef]);

  return status;
}
