export interface EventArtwork {
  id: string;
  eventName: string;
  tagline: string;
  artwork: string;
  category: string;
}

export async function pullBackendEventArtworks(): Promise<EventArtwork[]> {
  try {
    const res = await fetch('/api/events/artworks');
    if (res.ok) {
      const data = await res.json();
      if (data.success && Array.isArray(data.artworks)) {
        return data.artworks;
      }
    }
  } catch (err) {
    console.warn('Backend artwork fetch fallback triggered:', err);
  }

  return [
    {
      id: 'grandAffair',
      eventName: 'THE GRAND AFFAIR',
      tagline: 'An Evening of Extraordinary Experiences',
      artwork: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=1000&auto=format&fit=crop',
      category: 'Gala & Gala Night',
    },
    {
      id: 'metGalaAuction',
      eventName: 'THE METROPOLITAN GALA',
      tagline: 'Private Art Collection & Philanthropy Auction',
      artwork: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=1000&auto=format&fit=crop',
      category: 'Philanthropy & Fine Art',
    },
    {
      id: 'monacoYacht',
      eventName: 'MONACO YACHT LOUNGE',
      tagline: 'Formula 1 Midnight Soirée & Afterparty',
      artwork: 'https://images.unsplash.com/photo-1567899378494-47b22a2ae96a?q=80&w=1000&auto=format&fit=crop',
      category: 'Yacht & Riviera Soirée',
    },
  ];
}

export async function pullTicketArtwork(identifier: string): Promise<string> {
  try {
    const res = await fetch(`/api/ticket/${encodeURIComponent(identifier)}/artwork`);
    if (res.ok) {
      const data = await res.json();
      if (data.success && data.artworkUrl) {
        return data.artworkUrl;
      }
    }
  } catch (err) {
    console.warn('Failed to pull ticket artwork from API:', err);
  }
  return 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=1000&auto=format&fit=crop';
}

export async function downloadEventArtwork(imageUrl: string, filename = 'event-artwork.jpg'): Promise<void> {
  try {
    let blob: Blob;
    if (imageUrl.startsWith('data:')) {
      const response = await fetch(imageUrl);
      blob = await response.blob();
    } else {
      const directRes = await fetch(imageUrl, { mode: 'cors' });
      blob = await directRes.blob();
    }

    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  } catch (err) {
    console.error('Failed to download event artwork:', err);
    window.open(imageUrl, '_blank');
  }
}
