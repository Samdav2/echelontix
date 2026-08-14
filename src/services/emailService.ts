import { EchelontixTicketData } from '../types/ticket';
import { getTicketTheme } from './themeService';

/**
 * Generates email-safe, production-ready responsive HTML for Gmail & mobile email clients.
 * Uses inline CSS, table layouts, and fallback typography.
 */
export function generateGmailEmailHtml(
  ticketData: EchelontixTicketData,
  qrDataUrl: string
): string {
  const theme = getTicketTheme(ticketData.ticket.tier);

  return `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" style="background-color: #080808; margin: 0; padding: 0;">
<head>
  <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Echelontix | ${ticketData.event.name} Access Pass</title>
  <style type="text/css">
    body, table, td, a { -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
    table, td { mso-table-lspace: 0pt; mso-table-rspace: 0pt; }
    img { -ms-interpolation-mode: bicubic; border: 0; height: auto; line-height: 100%; outline: none; text-decoration: none; }
    table { border-collapse: collapse !important; }
    body { height: 100% !important; margin: 0 !important; padding: 0 !important; width: 100% !important; background-color: #080808; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; color: #F5F3EE; }
    
    @media screen and (max-width: 600px) {
      .email-container { width: 100% !important; padding: 12px !important; }
      .mobile-stack { display: block !important; width: 100% !important; }
      .hero-title { font-size: 24px !important; }
    }
  </style>
</head>
<body style="background-color: #080808; margin: 0; padding: 0; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; color: #F5F3EE;">

  <!-- Main Container Table -->
  <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #080808; table-layout: fixed;">
    <tr>
      <td align="center" style="padding: 24px 8px;">
        
        <table border="0" cellpadding="0" cellspacing="0" width="560" class="email-container" style="max-width: 560px; background-color: #141414; border: 1px solid #282828; border-radius: 12px; overflow: hidden; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;">
          
          <!-- BRAND HEADER -->
          <tr>
            <td align="center" style="padding: 28px 24px 20px 24px; border-bottom: 1px solid #222222; background-color: #0B0B0B;">
              <table border="0" cellpadding="0" cellspacing="0" width="100%">
                <tr>
                  <td align="center">
                    <div style="font-size: 20px; font-weight: 700; letter-spacing: 0.3em; color: #C8A96B; text-transform: uppercase;">ECHELONTIX</div>
                    <div style="font-size: 9px; letter-spacing: 0.25em; color: #A6A6A6; text-transform: uppercase; margin-top: 6px;">AUTHENTICATED DIGITAL ACCESS CREDENTIAL</div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- CONFIRMATION BANNER -->
          <tr>
            <td align="center" style="padding: 16px 24px; background-color: #101010; border-bottom: 1px solid #1F1F1F;">
              <span style="display: inline-block; padding: 4px 12px; background-color: rgba(200, 169, 107, 0.12); border: 1px solid #C8A96B; border-radius: 100px; color: #E3C98A; font-size: 11px; font-weight: 600; letter-spacing: 0.15em; text-transform: uppercase;">
                YOUR ACCESS IS CONFIRMED
              </span>
            </td>
          </tr>

          <!-- HERO EVENT ARTWORK -->
          <tr>
            <td align="center" style="padding: 0; position: relative;">
              <img src="${ticketData.event.artwork}" alt="${ticketData.event.name}" width="560" style="display: block; width: 100%; max-height: 280px; object-fit: cover; border: 0;" />
            </td>
          </tr>

          <!-- EVENT TITLE & TAGLINE -->
          <tr>
            <td align="center" style="padding: 28px 28px 20px 28px; background-color: #141414;">
              <h1 class="hero-title" style="margin: 0; font-size: 28px; font-weight: 700; color: #F5F3EE; letter-spacing: 0.05em; line-height: 1.2; text-transform: uppercase;">
                ${ticketData.event.name}
              </h1>
              ${ticketData.event.tagline ? `
              <p style="margin: 10px 0 0 0; font-size: 13px; color: #C8A96B; letter-spacing: 0.08em; text-transform: uppercase;">
                ${ticketData.event.tagline}
              </p>` : ''}
            </td>
          </tr>

          <!-- EVENT DETAILS GRID -->
          <tr>
            <td style="padding: 0 28px 24px 28px;">
              <table border="0" cellpadding="12" cellspacing="0" width="100%" style="background-color: #0A0A0A; border: 1px solid #222222; border-radius: 8px;">
                <tr>
                  <td width="33%" align="center" style="border-right: 1px solid #222222;">
                    <div style="font-size: 9px; letter-spacing: 0.15em; color: #A6A6A6; text-transform: uppercase;">DATE</div>
                    <div style="font-size: 13px; font-weight: 600; color: #F5F3EE; margin-top: 4px;">${ticketData.event.date}</div>
                  </td>
                  <td width="33%" align="center" style="border-right: 1px solid #222222;">
                    <div style="font-size: 9px; letter-spacing: 0.15em; color: #A6A6A6; text-transform: uppercase;">TIME</div>
                    <div style="font-size: 13px; font-weight: 600; color: #F5F3EE; margin-top: 4px;">${ticketData.event.time}</div>
                  </td>
                  <td width="34%" align="center">
                    <div style="font-size: 9px; letter-spacing: 0.15em; color: #A6A6A6; text-transform: uppercase;">VENUE</div>
                    <div style="font-size: 13px; font-weight: 600; color: #F5F3EE; margin-top: 4px;">${ticketData.event.venue}</div>
                    <div style="font-size: 10px; color: #A6A6A6; margin-top: 2px;">${ticketData.event.location}</div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- ACCESS CARD SECTION -->
          <tr>
            <td style="padding: 0 28px 24px 28px;">
              <table border="0" cellpadding="18" cellspacing="0" width="100%" style="background-color: #1A1A1E; border: 1px solid ${theme.accentColor}; border-radius: 8px;">
                <tr>
                  <td>
                    <table border="0" cellpadding="0" cellspacing="0" width="100%">
                      <tr>
                        <td align="left">
                          <div style="font-size: 9px; letter-spacing: 0.2em; color: #A6A6A6; text-transform: uppercase;">ACCESS CREDENTIAL</div>
                          <div style="font-size: 20px; font-weight: 700; color: #F5F3EE; margin-top: 4px; letter-spacing: 0.05em;">
                            ${ticketData.attendee.name}
                          </div>
                        </td>
                        <td align="right" valign="top">
                          <span style="display: inline-block; padding: 6px 14px; background-color: #080808; border: 1px solid ${theme.accentColor}; color: ${theme.metallicColor}; font-size: 12px; font-weight: 700; letter-spacing: 0.2em; border-radius: 4px;">
                            ${ticketData.ticket.tier}
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td colspan="2" style="padding-top: 14px; border-top: 1px solid #28282D; margin-top: 14px;">
                          <table border="0" cellpadding="0" cellspacing="0" width="100%">
                            <tr>
                              <td>
                                <span style="font-size: 10px; color: #A6A6A6; letter-spacing: 0.1em; text-transform: uppercase;">TICKET ID:</span>
                                <span style="font-size: 12px; font-weight: 600; color: #C8A96B; font-family: monospace; margin-left: 6px;">${ticketData.ticket.ticketId}</span>
                              </td>
                              <td align="right">
                                <span style="font-size: 10px; color: #A6A6A6; letter-spacing: 0.1em; text-transform: uppercase;">SEC CODE:</span>
                                <span style="font-size: 12px; font-weight: 600; color: #E3C98A; font-family: monospace; margin-left: 6px;">${ticketData.ticket.securityCode}</span>
                              </td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- DEDICATED QR CODE SECTION -->
          <tr>
            <td align="center" style="padding: 0 28px 28px 28px;">
              <table border="0" cellpadding="20" cellspacing="0" width="100%" style="background-color: #FFFFFF; border-radius: 12px; text-align: center;">
                <tr>
                  <td align="center">
                    <div style="font-size: 11px; font-weight: 700; letter-spacing: 0.2em; color: #080808; text-transform: uppercase; margin-bottom: 12px;">
                      YOUR ENTRY PASS
                    </div>
                    
                    <!-- QR IMAGE -->
                    <div style="display: inline-block; padding: 12px; background-color: #FFFFFF; border: 1px solid #E0E0E0; border-radius: 8px;">
                      <img src="${qrDataUrl}" alt="Entry QR Pass" width="180" height="180" style="display: block; width: 180px; height: 180px; border: 0;" />
                    </div>

                    <div style="font-size: 11px; color: #555555; margin-top: 12px; font-weight: 500;">
                      Scan this code at the venue entrance for access.
                    </div>
                    <div style="font-size: 11px; font-weight: 700; color: #080808; font-family: monospace; letter-spacing: 0.15em; margin-top: 6px;">
                      ETX • ${ticketData.ticket.securityCode}
                    </div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- CTA BUTTONS -->
          <tr>
            <td align="center" style="padding: 0 28px 32px 28px;">
              <table border="0" cellpadding="0" cellspacing="0" width="100%">
                <tr>
                  <td align="center" style="padding-bottom: 12px;">
                    <a href="#" style="display: block; width: 100%; box-sizing: border-box; padding: 14px 24px; background-color: #C8A96B; color: #080808; text-decoration: none; font-size: 12px; font-weight: 700; letter-spacing: 0.2em; text-transform: uppercase; border-radius: 6px; text-align: center;">
                      VIEW DIGITAL ACCESS CREDENTIAL
                    </a>
                  </td>
                </tr>
                <tr>
                  <td align="center">
                    <a href="#" style="display: block; width: 100%; box-sizing: border-box; padding: 12px 24px; background-color: #1A1A1A; border: 1px solid #333333; color: #F5F3EE; text-decoration: none; font-size: 11px; font-weight: 600; letter-spacing: 0.15em; text-transform: uppercase; border-radius: 6px; text-align: center;">
                      DOWNLOAD MOBILE PDF TICKET
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- FOOTER -->
          <tr>
            <td align="center" style="padding: 24px; background-color: #0A0A0A; border-top: 1px solid #1E1E1E;">
              <div style="font-size: 12px; font-weight: 700; color: #C8A96B; letter-spacing: 0.2em; text-transform: uppercase;">
                ECHELONTIX
              </div>
              <div style="font-size: 11px; color: #A6A6A6; margin-top: 8px;">
                Questions regarding your access credential? Contact <a href="mailto:hello@echelontix.com" style="color: #E3C98A; text-decoration: underline;">hello@echelontix.com</a>
              </div>
              <div style="font-size: 11px; color: #888888; font-style: italic; margin-top: 12px;">
                THANK YOU — We can't wait to see you at ${ticketData.event.name}.
              </div>
              <div style="font-size: 9px; color: #555555; letter-spacing: 0.1em; text-transform: uppercase; margin-top: 16px;">
                THIS TICKET IS UNIQUE AND NON-TRANSFERABLE • AUTHENTICATED CREDENTIAL
              </div>
            </td>
          </tr>

        </table>

      </td>
    </tr>
  </table>

</body>
</html>`;
}
