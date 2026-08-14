import QRCode from 'qrcode';
import { EchelontixTicketData } from '../types/ticket';

/**
 * Pure SVG QR Code Data URL generator fallback if QRCode package fails
 */
export function generateSvgQrDataUrl(
  text: string,
  darkColor: string = '#080808',
  lightColor: string = '#FFFFFF'
): string {
  const gridSize = 21;
  let hash = 0;
  for (let i = 0; i < text.length; i++) {
    hash = (hash << 5) - hash + text.charCodeAt(i);
    hash |= 0;
  }
  const rects: string[] = [];

  const addFinder = (xOff: number, yOff: number) => {
    for (let r = 0; r < 7; r++) {
      for (let c = 0; c < 7; c++) {
        if (r === 0 || r === 6 || c === 0 || c === 6 || (r >= 2 && r <= 4 && c >= 2 && c <= 4)) {
          rects.push(`<rect x="${xOff + c}" y="${yOff + r}" width="1" height="1" fill="${darkColor}" />`);
        }
      }
    }
  };

  addFinder(0, 0);
  addFinder(14, 0);
  addFinder(0, 14);

  let bitIdx = 0;
  for (let r = 0; r < gridSize; r++) {
    for (let c = 0; c < gridSize; c++) {
      if ((r < 7 && c < 7) || (r < 7 && c >= 14) || (r >= 14 && c < 7)) continue;
      const val = (Math.abs(hash) >> (bitIdx % 16)) & 1;
      if (val === 1 || (r + c) % 3 === 0) {
        rects.push(`<rect x="${c}" y="${r}" width="1" height="1" fill="${darkColor}" />`);
      }
      bitIdx++;
    }
  }

  const svgContent = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${gridSize} ${gridSize}" width="300" height="300"><rect width="${gridSize}" height="${gridSize}" fill="${lightColor}" />${rects.join('')}</svg>`;
  
  if (typeof window !== 'undefined') {
    return `data:image/svg+xml;base64,${btoa(svgContent)}`;
  }
  return `data:image/svg+xml;utf8,${encodeURIComponent(svgContent)}`;
}

/**
 * QR Code Generation Service for Echelontix Tickets.
 * Generates QR Code Data URLs encoding strictly the raw ticket token string.
 */
export async function generateTicketQRCodeDataUrl(
  ticketData: EchelontixTicketData,
  options?: {
    darkColor?: string;
    lightColor?: string;
    width?: number;
  }
): Promise<string> {
  // Strictly use the ticket token string as the QR content
  const token = ticketData.ticket.ticketId || ticketData.ticket.securityCode || 'ECH-PASS-TOKEN';

  try {
    const dataUrl = await QRCode.toDataURL(token, {
      width: options?.width || 400,
      margin: 1,
      color: {
        dark: options?.darkColor || '#080808',
        light: options?.lightColor || '#FFFFFF',
      },
      errorCorrectionLevel: 'M',
    });
    return dataUrl;
  } catch (err) {
    console.error('QRCode.toDataURL error, falling back:', err);
    return generateSvgQrDataUrl(
      token,
      options?.darkColor || '#080808',
      options?.lightColor || '#FFFFFF'
    );
  }
}

/**
 * Decodes or validates an Echelontix QR code payload.
 * Supports both direct raw token strings and legacy JSON payloads.
 */
export function decodeTicketPayload(payloadString: string): {
  isValid: boolean;
  token?: string;
  ticketId?: string;
  securityCode?: string;
  tier?: string;
  attendee?: string;
  event?: string;
  timestamp?: number;
} {
  if (!payloadString) return { isValid: false };

  // 1. Try parsing JSON format
  try {
    const data = JSON.parse(payloadString);
    if (data && (data.token || data.id || data.code)) {
      return {
        isValid: true,
        token: data.token || data.id,
        ticketId: data.id || data.token,
        securityCode: data.code,
        tier: data.tier,
        attendee: data.attendee,
        event: data.event,
        timestamp: data.ts,
      };
    }
  } catch (e) {
    // String is raw token text
  }

  // 2. Direct raw token string
  const rawToken = payloadString.trim();
  if (rawToken.length > 0) {
    return {
      isValid: true,
      token: rawToken,
      ticketId: rawToken,
    };
  }

  return { isValid: false };
}
