import { escapeHtml } from './print';

/** Preserve supported semantic formatting while removing pasted attributes and active markup. */
export function cleanEditorHtml(html: string): string {
  const doc = new DOMParser().parseFromString(html, 'text/html');
  const serialize = (node: Node): string => {
    if (node.nodeType === Node.TEXT_NODE) return escapeHtml(node.textContent || '');
    if (!(node instanceof Element)) return '';
    const tag = node.tagName.toLowerCase();
    if (['script', 'style', 'iframe', 'object', 'svg', 'img'].includes(tag)) return '';
    const body = Array.from(node.childNodes).map(serialize).join('');
    if (tag === 'br') return '<br/>';
    if (tag === 'hr') return '<p class="section-break">✦ ✦ ✦</p>';
    if (tag === 'div') return `<p>${body}</p>`;
    if (['p', 'strong', 'em', 'b', 'i', 'u', 'h2', 'h3', 'ul', 'ol', 'li', 'blockquote'].includes(tag)) {
      const attribute = tag === 'p' && node.classList.contains('section-break') ? ' class="section-break"' : '';
      return `<${tag}${attribute}>${body}</${tag}>`;
    }
    return body;
  };
  return Array.from(doc.body.childNodes).map(serialize).join('');
}
