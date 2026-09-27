import '@testing-library/jest-dom';
import { vi } from 'vitest';

if (typeof HTMLCanvasElement !== 'undefined') {
  HTMLCanvasElement.prototype.getContext = vi.fn().mockImplementation((contextId: string) => {
    if (contextId === '2d') {
      return {
        fillStyle: '',
        strokeStyle: '',
        lineWidth: 1,
        fillRect: vi.fn(),
        clearRect: vi.fn(),
        getImageData: vi.fn(),
        putImageData: vi.fn(),
        createImageData: vi.fn(),
        setTransform: vi.fn(),
        drawImage: vi.fn(),
        save: vi.fn(),
        fillText: vi.fn(),
        restore: vi.fn(),
        beginPath: vi.fn(),
        moveTo: vi.fn(),
        lineTo: vi.fn(),
        closePath: vi.fn(),
        stroke: vi.fn(),
        fill: vi.fn(),
        roundRect: vi.fn(),
        createLinearGradient: vi.fn().mockReturnValue({
          addColorStop: vi.fn(),
        }),
      };
    }
    return null;
  });

  HTMLCanvasElement.prototype.toDataURL = vi.fn().mockReturnValue('data:image/png;base64,mocked');
  HTMLCanvasElement.prototype.toBlob = vi.fn().mockImplementation((cb: (blob: Blob | null) => void) => {
    cb(new Blob(['mocked'], { type: 'image/png' }));
  });
}
