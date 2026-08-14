import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

/**
 * Regex matching modern unsupported CSS color functions in html2canvas:
 * oklab(), oklch(), lab(), lch(), color-mix(), color(), light-dark(), hwb()
 */
const UNSUPPORTED_COLOR_REGEX = /(?:oklab|oklch|lab|lch|color-mix|color|light-dark|hwb)\s*\(/i;

/**
 * Helper to sanitize all occurrences of modern unsupported color functions from CSS text.
 */
function sanitizeCssText(cssText: string): string {
  if (!cssText) return '';
  let cleaned = cssText;
  const pattern = /(?:oklab|oklch|lab|lch|color-mix|color|light-dark|hwb)\s*\([^;{}]+?\)/gi;
  for (let i = 0; i < 4; i++) {
    if (!UNSUPPORTED_COLOR_REGEX.test(cleaned)) break;
    cleaned = cleaned.replace(pattern, '#121214');
    cleaned = cleaned.replace(/(?:oklab|oklch|lab|lch|color-mix|color|light-dark|hwb)\s*\([^)]*\)/gi, '#121214');
  }
  return cleaned;
}

/**
 * Converts image URLs into inline Base64 Data URLs to ensure crisp rendering
 * and bypass CORS canvas taints in html2canvas PDF exports.
 */
async function fetchImageAsDataUrl(url: string): Promise<string | null> {
  if (!url || url.startsWith('data:')) return url;
  try {
    const res = await fetch(url, { mode: 'cors' });
    const blob = await res.blob();
    return await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = () => reject(null);
      reader.readAsDataURL(blob);
    });
  } catch (e) {
    return new Promise<string | null>((resolve) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        try {
          const canvas = document.createElement('canvas');
          canvas.width = img.naturalWidth || 400;
          canvas.height = img.naturalHeight || 300;
          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.drawImage(img, 0, 0);
            resolve(canvas.toDataURL('image/png'));
            return;
          }
        } catch (err) {}
        resolve(null);
      };
      img.onerror = () => resolve(null);
      img.src = url;
    });
  }
}

async function convertAllImagesToBase64(container: HTMLElement): Promise<void> {
  const images = Array.from(container.querySelectorAll('img'));
  await Promise.all(
    images.map(async (img) => {
      try {
        const src = img.getAttribute('src') || img.src;
        if (src && !src.startsWith('data:')) {
          const dataUrl = await fetchImageAsDataUrl(src);
          if (dataUrl) {
            img.src = dataUrl;
          }
        }
      } catch (e) {
        // Fallback gracefully if single image fetch fails
      }
    })
  );
}

/**
 * PDF Generation Service for Echelontix Mobile Credentials.
 * Captures the vertical mobile credential element and renders a high-DPI 1-page PDF.
 * Pre-converts images to Base64 data URLs before html2canvas capture to ensure artwork
 * and QR codes render with 100% visibility.
 */
export async function generateMobileTicketPdf(
  elementId: string,
  fileName: string = 'Echelontix-Digital-Pass.pdf'
): Promise<void> {
  const element = document.getElementById(elementId);
  if (!element) {
    throw new Error(`Element with id "${elementId}" not found for PDF export.`);
  }

  // Pre-convert images on the DOM element BEFORE passing to html2canvas
  await convertAllImagesToBase64(element);

  // Intercept CanvasRenderingContext2D.prototype.createPattern in main window context
  const origCreatePattern = window.CanvasRenderingContext2D.prototype.createPattern;
  window.CanvasRenderingContext2D.prototype.createPattern = function (
    image: any,
    repetition: string | null
  ) {
    if (image && ('width' in image || 'height' in image)) {
      if ((image.width || 0) === 0 || (image.height || 0) === 0) {
        const dummyCanvas = document.createElement('canvas');
        dummyCanvas.width = 1;
        dummyCanvas.height = 1;
        return origCreatePattern.call(this, dummyCanvas, repetition || 'repeat');
      }
    }
    try {
      return origCreatePattern.call(this, image, repetition);
    } catch (e) {
      const dummyCanvas = document.createElement('canvas');
      dummyCanvas.width = 1;
      dummyCanvas.height = 1;
      return origCreatePattern.call(this, dummyCanvas, repetition || 'repeat');
    }
  };

  try {
    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#080808',
      logging: false,
      onclone: (clonedDoc) => {
        // 1. Process and sanitize all <style> and <link rel="stylesheet"> nodes
        const styleNodes = Array.from(clonedDoc.querySelectorAll('style, link[rel="stylesheet"]'));
        styleNodes.forEach((node) => {
          try {
            if (node.tagName.toLowerCase() === 'link') {
              const linkEl = node as HTMLLinkElement;
              if (linkEl.sheet) {
                let cssText = '';
                const rules = linkEl.sheet.cssRules || linkEl.sheet.rules;
                if (rules) {
                  for (let i = 0; i < rules.length; i++) {
                    cssText += rules[i].cssText + '\n';
                  }
                }
                const sanitizedCss = sanitizeCssText(cssText);
                const styleEl = clonedDoc.createElement('style');
                styleEl.textContent = sanitizedCss;
                linkEl.parentNode?.replaceChild(styleEl, linkEl);
              } else {
                linkEl.remove();
              }
            } else if (node.tagName.toLowerCase() === 'style') {
              const styleEl = node as HTMLStyleElement;
              if (styleEl.textContent) {
                styleEl.textContent = sanitizeCssText(styleEl.textContent);
              }
            }
          } catch (e) {
            try {
              node.remove();
            } catch (err) {}
          }
        });

        // 2. Patch CanvasRenderingContext2D inside clonedDoc iframe window
        if (clonedDoc.defaultView && clonedDoc.defaultView.CanvasRenderingContext2D) {
          clonedDoc.defaultView.CanvasRenderingContext2D.prototype.createPattern = window.CanvasRenderingContext2D.prototype.createPattern;
        }

        // 3. Patch getComputedStyle on the cloned document window
        if (clonedDoc.defaultView) {
          const origGetComputedStyle = clonedDoc.defaultView.getComputedStyle;
          clonedDoc.defaultView.getComputedStyle = function (el: Element, pseudoElt?: string | null) {
            const style = origGetComputedStyle.call(clonedDoc.defaultView, el, pseudoElt);
            return new Proxy(style, {
              get(target, prop) {
                const val = Reflect.get(target, prop);
                if (typeof val === 'string' && UNSUPPORTED_COLOR_REGEX.test(val)) {
                  return sanitizeCssText(val) || 'rgb(18, 18, 20)';
                }
                if (typeof val === 'function' && prop === 'getPropertyValue') {
                  return (propertyName: string) => {
                    const rawVal = target.getPropertyValue(propertyName);
                    if (rawVal && UNSUPPORTED_COLOR_REGEX.test(rawVal)) {
                      return sanitizeCssText(rawVal) || 'rgb(18, 18, 20)';
                    }
                    return rawVal;
                  };
                }
                return val;
              }
            });
          };
        }

        // 4. Sanitize inline element styles across all DOM elements
        const elements = clonedDoc.querySelectorAll('*');
        elements.forEach((el) => {
          const htmlEl = el as HTMLElement;
          if (htmlEl.style && htmlEl.style.cssText) {
            if (UNSUPPORTED_COLOR_REGEX.test(htmlEl.style.cssText)) {
              htmlEl.style.cssText = sanitizeCssText(htmlEl.style.cssText);
            }
          }
        });

        // 5. Reset transform, shadow, and border radius on credential pass
        const clonedEl = clonedDoc.getElementById(elementId);
        if (clonedEl) {
          clonedEl.style.transform = 'none';
          clonedEl.style.boxShadow = 'none';
          clonedEl.style.borderRadius = '0px';
        }
      },
    });

    const imgData = canvas.toDataURL('image/png', 1.0);
    const imgWidth = canvas.width;
    const imgHeight = canvas.height;

    if (imgWidth <= 0 || imgHeight <= 0) {
      throw new Error('Canvas render dimensions must be greater than zero.');
    }

    const pdfWidth = 108;
    const pdfHeight = (imgHeight * pdfWidth) / imgWidth;

    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: [pdfWidth, pdfHeight],
    });

    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight, undefined, 'FAST');
    pdf.save(fileName);
  } finally {
    window.CanvasRenderingContext2D.prototype.createPattern = origCreatePattern;
  }
}
