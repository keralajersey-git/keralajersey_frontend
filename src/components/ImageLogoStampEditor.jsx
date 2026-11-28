import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { FiCheck, FiRotateCcw, FiX } from "react-icons/fi";

const MAX_IMAGE_EDGE = 1600;
const MotionDiv = motion.div;
const MotionSection = motion.section;

const drawKJStamp = (context, position, size) => {
  if (!position || !size) return;

  const radius = size / 2;
  context.save();
  context.beginPath();
  context.arc(position.x, position.y, radius, 0, Math.PI * 2);
  context.fillStyle = "#050505";
  context.fill();
  context.lineWidth = Math.max(1.5, size * 0.025);
  context.strokeStyle = "rgba(255, 255, 255, 0.9)";
  context.stroke();
  context.fillStyle = "#ffffff";
  context.textAlign = "center";
  context.textBaseline = "middle";
  context.font = `900 ${Math.round(size * 0.36)}px Arial, sans-serif`;
  context.fillText("KJ", position.x, position.y + size * 0.015);
  context.restore();
};

const ImageLogoStampEditor = ({ file, onCancel, onApply }) => {
  const canvasRef = useRef(null);
  const imageRef = useRef(null);
  const isDraggingRef = useRef(false);
  const dragOffsetRef = useRef({ x: 0, y: 0 });
  const [canvasSize, setCanvasSize] = useState({ width: 0, height: 0 });
  const [logoPosition, setLogoPosition] = useState(null);
  const [logoSize, setLogoSize] = useState(0);
  const [defaultPosition, setDefaultPosition] = useState(null);
  const [defaultSize, setDefaultSize] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isApplying, setIsApplying] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    const objectUrl = URL.createObjectURL(file);
    const image = new Image();

    image.onload = () => {
      if (cancelled) return;
      const scale = Math.min(
        1,
        MAX_IMAGE_EDGE / Math.max(image.naturalWidth, image.naturalHeight),
      );
      const canvas = canvasRef.current;
      if (!canvas) return;

      canvas.width = Math.max(1, Math.round(image.naturalWidth * scale));
      canvas.height = Math.max(1, Math.round(image.naturalHeight * scale));
      if (!canvas.getContext("2d")) {
        setError("This image could not be opened for editing.");
        setIsLoading(false);
        return;
      }

      const shortSide = Math.min(canvas.width, canvas.height);
      const minSize = Math.min(28, Math.max(12, Math.round(shortSide * 0.04)));
      const maxSize = Math.max(minSize + 1, Math.round(shortSide * 0.42));
      const initialSize = Math.min(
        maxSize,
        Math.max(minSize, Math.round(shortSide * 0.12)),
      );
      const initialPosition = {
        x: canvas.width - initialSize * 0.72,
        y: canvas.height - initialSize * 0.72,
      };

      imageRef.current = image;
      setCanvasSize({ width: canvas.width, height: canvas.height });
      setLogoSize(initialSize);
      setLogoPosition(initialPosition);
      setDefaultSize(initialSize);
      setDefaultPosition(initialPosition);
      setError("");
      setIsLoading(false);
    };

    image.onerror = () => {
      if (cancelled) return;
      setError("This image format could not be edited in your browser.");
      setIsLoading(false);
    };
    image.src = objectUrl;

    return () => {
      cancelled = true;
      URL.revokeObjectURL(objectUrl);
      imageRef.current = null;
    };
  }, [file]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const image = imageRef.current;
    const context = canvas?.getContext("2d");
    if (!canvas || !image || !context) return;

    context.clearRect(0, 0, canvas.width, canvas.height);
    context.drawImage(image, 0, 0, canvas.width, canvas.height);
    drawKJStamp(context, logoPosition, logoSize);
  }, [logoPosition, logoSize, canvasSize]);

  const getCanvasPoint = (event) => {
    const canvas = canvasRef.current;
    if (!canvas) return null;
    const bounds = canvas.getBoundingClientRect();
    if (!bounds.width || !bounds.height) return null;
    return {
      x: ((event.clientX - bounds.left) / bounds.width) * canvas.width,
      y: ((event.clientY - bounds.top) / bounds.height) * canvas.height,
    };
  };

  const clampPosition = (point, size = logoSize) => {
    const radius = size / 2;
    return {
      x: Math.max(radius, Math.min(canvasSize.width - radius, point.x)),
      y: Math.max(radius, Math.min(canvasSize.height - radius, point.y)),
    };
  };

  const handlePointerDown = (event) => {
    if (isLoading || isApplying || error) return;
    event.preventDefault();
    const point = getCanvasPoint(event);
    const canvas = canvasRef.current;
    if (!point || !canvas) return;

    const distance = Math.hypot(
      point.x - logoPosition.x,
      point.y - logoPosition.y,
    );
    dragOffsetRef.current =
      distance <= logoSize / 2 + 12
        ? { x: point.x - logoPosition.x, y: point.y - logoPosition.y }
        : { x: 0, y: 0 };
    isDraggingRef.current = true;
    canvas.setPointerCapture?.(event.pointerId);
    setLogoPosition(clampPosition({
      x: point.x - dragOffsetRef.current.x,
      y: point.y - dragOffsetRef.current.y,
    }));
  };

  const handlePointerMove = (event) => {
    if (!isDraggingRef.current) return;
    event.preventDefault();
    const point = getCanvasPoint(event);
    if (!point) return;
    setLogoPosition(clampPosition({
      x: point.x - dragOffsetRef.current.x,
      y: point.y - dragOffsetRef.current.y,
    }));
  };

  const finishDragging = () => {
    isDraggingRef.current = false;
  };

  const resetStamp = () => {
    setLogoSize(defaultSize);
    setLogoPosition(defaultPosition);
    setError("");
  };

  const applyImage = async () => {
    if (isLoading || error || isApplying) return;
    setIsApplying(true);
    setError("");

    try {
      const canvas = canvasRef.current;
      const blob = await new Promise((resolve) =>
        canvas?.toBlob(resolve, "image/png"),
      );
      if (!blob) throw new Error("Could not prepare the image with its KJ logo.");
      const baseName = file.name.replace(/\.[^.]+$/, "") || "product-image";
      const stampedFile = new File([blob], `${baseName}-kj.png`, {
        type: "image/png",
      });
      await onApply(stampedFile);
    } catch (applyError) {
      setError(applyError.message || "Could not prepare this image.");
      setIsApplying(false);
    }
  };

  const shortSide = Math.min(canvasSize.width, canvasSize.height);
  const minLogoSize = Math.min(28, Math.max(12, Math.round(shortSide * 0.04)));
  const maxLogoSize = Math.max(minLogoSize + 1, Math.round(shortSide * 0.42));

  return (
    <MotionDiv
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[1100] flex items-center justify-center bg-black/70 p-2 sm:p-5"
      role="dialog"
      aria-modal="true"
      aria-labelledby="image-editor-title"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget && !isApplying) onCancel();
      }}
    >
      <MotionSection
        initial={{ opacity: 0, y: 16, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 12, scale: 0.98 }}
        className="flex max-h-[96vh] w-full max-w-5xl flex-col overflow-hidden rounded-xl bg-white shadow-2xl"
      >
        <header className="flex items-start justify-between gap-3 border-b border-gray-100 px-4 py-3 sm:px-6">
          <div>
            <h2 id="image-editor-title" className="text-base font-black text-gray-900 sm:text-lg">
              Add KJ logo to product image
            </h2>
            <p className="mt-1 text-xs text-gray-500">
              Drag the black KJ stamp to position it, then adjust its size below.
            </p>
          </div>
          <button
            type="button"
            onClick={onCancel}
            disabled={isApplying}
            aria-label="Close image editor"
            className="rounded-full p-2 text-gray-500 transition hover:bg-gray-100 hover:text-gray-900 disabled:opacity-40"
          >
            <FiX className="h-5 w-5" />
          </button>
        </header>

        <div
          className="relative flex min-h-[220px] flex-1 items-center justify-center overflow-auto p-3 sm:min-h-[300px] sm:p-5"
          style={{
            backgroundColor: "#f1f1f1",
            backgroundImage:
              "linear-gradient(45deg, #dedede 25%, transparent 25%), linear-gradient(-45deg, #dedede 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #dedede 75%), linear-gradient(-45deg, transparent 75%, #dedede 75%)",
            backgroundSize: "20px 20px",
            backgroundPosition: "0 0, 0 10px, 10px -10px, -10px 0",
          }}
        >
          {isLoading && !error && (
            <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/80 text-sm font-semibold text-gray-600">
              Preparing image…
            </div>
          )}
          {error && (
            <div className="absolute inset-0 z-20 flex items-center justify-center bg-white/95 p-6 text-center text-sm font-semibold text-red-600">
              {error}
            </div>
          )}
          <canvas
            ref={canvasRef}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={finishDragging}
            onPointerCancel={finishDragging}
            className="block max-h-[54vh] max-w-full touch-none cursor-move object-contain sm:max-h-[62vh]"
            aria-label="Product image preview with a draggable KJ logo stamp"
          />
        </div>

        <div className="space-y-3 border-t border-gray-100 px-4 py-3 sm:px-6 sm:py-4">
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
            <label className="flex min-w-[180px] flex-1 items-center gap-3 text-xs font-bold text-gray-600">
              <span className="shrink-0">Logo size: {logoSize}px</span>
              <input
                type="range"
                min={minLogoSize}
                max={maxLogoSize}
                step="1"
                value={logoSize || minLogoSize}
                onChange={(event) => {
                  const nextSize = Number(event.target.value);
                  setLogoSize(nextSize);
                  setLogoPosition((position) =>
                    position ? clampPosition(position, nextSize) : position,
                  );
                }}
                disabled={isLoading || isApplying || Boolean(error)}
                aria-label="KJ logo size"
                className="h-2 min-w-20 flex-1 accent-gray-900"
              />
            </label>
            <button
              type="button"
              onClick={resetStamp}
              disabled={isLoading || isApplying || !defaultPosition}
              className="inline-flex items-center gap-2 rounded-lg border border-gray-200 px-3 py-2 text-xs font-bold text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <FiRotateCcw className="h-4 w-4" /> Reset position & size
            </button>
          </div>
          <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={onCancel}
              disabled={isApplying}
              className="rounded-lg border border-gray-200 px-4 py-2.5 text-sm font-bold text-gray-700 transition hover:bg-gray-50 disabled:opacity-40"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={applyImage}
              disabled={isLoading || Boolean(error) || isApplying}
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-gray-900 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-black disabled:cursor-wait disabled:opacity-50"
            >
              <FiCheck className="h-4 w-4" />
              {isApplying ? "Uploading…" : "Use image & upload"}
            </button>
          </div>
        </div>
      </MotionSection>
    </MotionDiv>
  );
};

export default ImageLogoStampEditor;
