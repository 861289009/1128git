
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

interface ResumeModalProps {
  isOpen: boolean;
  onClose: () => void;
  pdfUrl: string;
}

const ResumeModal: React.FC<ResumeModalProps> = ({ isOpen, onClose, pdfUrl }) => {
  const isImage = /\.(png|jpe?g|webp|gif|bmp|svg)(\?.*)?$/i.test(pdfUrl);
  const [zoomOpen, setZoomOpen] = React.useState(false);
  const [scale, setScale] = React.useState(1);
  const [translate, setTranslate] = React.useState({ x: 0, y: 0 });
  const pointers = React.useRef(new Map<number, { x: number; y: number }>());
  const startDistance = React.useRef<number | null>(null);
  const startScale = React.useRef<number>(1);
  const dragPrev = React.useRef<{ x: number; y: number } | null>(null);

  const getTwoPointers = (values: Iterable<{ x: number; y: number }>) => {
    const arr = Array.from(values);
    if (arr.length >= 2) {
      return [arr[0], arr[1]] as [
        { x: number; y: number },
        { x: number; y: number }
      ];
    }
    return null;
  };

  React.useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (zoomOpen) setZoomOpen(false);
        else if (isOpen) onClose();
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [isOpen, zoomOpen, onClose]);
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-white rounded-lg shadow-xl w-full max-w-4xl h-full max-h-[85vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center p-4 border-b">
              <h3 className="text-lg font-bold">简历</h3>
              <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-100">
                <X size={24} />
              </button>
            </div>
            <div className="flex-grow p-4 overflow-auto">
              {isImage ? (
                <img
                  src={pdfUrl}
                  alt="简历"
                  className="max-h-full max-w-full w-auto h-auto object-contain mx-auto cursor-zoom-in"
                  onClick={() => setZoomOpen(true)}
                />
              ) : (
                <iframe
                  src={pdfUrl}
                  width="100%"
                  height="100%"
                  title="简历"
                  className="border-none"
                />
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
      <AnimatePresence>
        {zoomOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] bg-black/80 backdrop-blur-sm flex items-center justify-center touch-none select-none"
            onClick={() => { setZoomOpen(false); setScale(1); setTranslate({ x: 0, y: 0 }); }}
            onPointerDown={(e) => {
              pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
              (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
              if (pointers.current.size === 1 && scale > 1) {
                dragPrev.current = { x: e.clientX, y: e.clientY };
              }
              if (pointers.current.size === 2) {
                const pair = getTwoPointers(pointers.current.values());
                if (pair) {
                  const [p0, p1] = pair;
                  const dx = p0.x - p1.x;
                  const dy = p0.y - p1.y;
                  startDistance.current = Math.hypot(dx, dy);
                  startScale.current = scale;
                }
              }
            }}
            onPointerMove={(e) => {
              if (!pointers.current.has(e.pointerId)) return;
              pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
              if (pointers.current.size === 2 && startDistance.current) {
                const pair = getTwoPointers(pointers.current.values());
                if (pair) {
                  const [p0, p1] = pair;
                  const dx = p0.x - p1.x;
                  const dy = p0.y - p1.y;
                  const distance = Math.hypot(dx, dy);
                  const ratio = distance / startDistance.current;
                  const next = Math.min(4, Math.max(1, startScale.current * ratio));
                  setScale(next);
                }
              } else if (pointers.current.size === 1 && scale > 1 && dragPrev.current) {
                const dx = e.clientX - dragPrev.current.x;
                const dy = e.clientY - dragPrev.current.y;
                dragPrev.current = { x: e.clientX, y: e.clientY };
                setTranslate((prev) => ({ x: prev.x + dx, y: prev.y + dy }));
              }
            }}
            onPointerUp={(e) => {
              pointers.current.delete(e.pointerId);
              dragPrev.current = null;
              if (pointers.current.size < 2) {
                startDistance.current = null;
                startScale.current = scale;
              }
            }}
            onPointerCancel={(e) => {
              pointers.current.delete(e.pointerId);
              startDistance.current = null;
              dragPrev.current = null;
            }}
            onWheel={(e) => {
              e.preventDefault();
              const delta = -e.deltaY / 500; // smooth zoom
              setScale((prev) => {
                const next = Math.min(4, Math.max(1, prev + delta));
                if (next === 1) setTranslate({ x: 0, y: 0 });
                return next;
              });
            }}
          >
            <motion.img
              initial={{ scale: 1 }}
              animate={{ scale: scale, x: translate.x, y: translate.y }}
              exit={{ scale: 0.95 }}
              src={pdfUrl}
              alt="简历预览"
              className={`max-w-[95vw] max-h-[95vh] object-contain ${scale > 1 ? 'cursor-grab' : 'cursor-zoom-out'}`}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </AnimatePresence>
  );
};

export default ResumeModal;
