import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { FiCheck, FiRotateCcw, FiTrash2, FiX } from "react-icons/fi";

const MAX_IMAGE_EDGE = 1600;
const MAX_CACHED_BLURS = 2;
const MotionDiv = motion.div;
const MotionSection = motion.section;

const paintBlurStroke = (targetContext, stroke, blurredCanvas, maskCanvas, overlayCanvas) => {
  const maskContext = maskCanvas.getContext("2d");
  const overlayContext = overlayCanvas.getContext("2d");
  if (!maskContext || !overlayContext) {
    throw new Error("Blur editing is not available in this browser.");
  }

  maskContext.clearRect(0, 0, maskCanvas.width, maskCanvas.height);
  maskContext.save();
  maskContext.fillStyle = "#fff";
  maskContext.strokeStyle = "#fff";
  maskContext.lineWidth = stroke.size;
  maskContext.lineCap = "round";
  maskContext.lineJoin = "round";

  if (stroke.points.length === 1) {
    maskContext.beginPath();
    maskContext.arc(
      stroke.points[0].x,
      stroke.points[0].y,
      stroke.size / 2,
      0,
      Math.PI * 2,
    );
    maskContext.fill();
  } else {
    maskContext.beginPath();
    maskContext.moveTo(stroke.points[0].x, stroke.points[0].y);
    for (let index = 1; index < stroke.points.length; index += 1) {
      maskContext.lineTo(stroke.points[index].x, stroke.points[index].y);
    }
    maskContext.stroke();
  }
  maskContext.restore();

  overlayContext.clearRect(0, 0, overlayCanvas.width, overlayCanvas.height);
  overlayContext.globalCompositeOperation = "source-over";
  overlayContext.drawImage(blurredCanvas, 0, 0);
  overlayContext.globalCompositeOperation = "destination-in";
  overlayContext.drawImage(maskCanvas, 0, 0);
  overlayContext.globalCompositeOperation = "source-over";

  targetContext.save();
  targetContext.globalCompositeOperation = "source-over";
  targetContext.drawImage(overlayCanvas, 0, 0);
  targetContext.restore();
};

const ImageBlurEditor = ({ file, onCancel, onApply }) => {
  const canvasRef = useRef(null);
  const imageRef = useRef(null);
  const maskCanvasRef = useRef(null);
  const overlayCanvasRef = useRef(null);
  const blurredCanvasesRef = useRef(new Map());
  const strokesRef = useRef([]);
  const activeStrokeRef = useRef(null);
  const drawingRef = useRef(false);
  const [brushSize, setBrushSize] = useState(100);
  const [blurStrength, setBlurStrength] = useState(12);
  const [canUndo, setCanUndo] = useState(false);
  const [hasEdits, setHasEdits] = useState(false);
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
      const context = canvas.getContext("2d");
      if (!context) {
        setError("This image could not be opened for editing.");
        setIsLoading(false);
        return;
      }

      context.drawImage(image, 0, 0, canvas.width, canvas.height);
      imageRef.current = image;
      maskCanvasRef.current = document.createElement("canvas");
      overlayCanvasRef.current = document.createElement("canvas");
      maskCanvasRef.current.width = canvas.width;
      maskCanvasRef.current.height = canvas.height;
      overlayCanvasRef.current.width = canvas.width;
      overlayCanvasRef.current.height = canvas.height;
      blurredCanvasesRef.current.clear();
      strokesRef.current = [];
      setCanUndo(false);
      setHasEdits(false);
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
    };
  }, [file]);

  const getBlurredCanvas = (strength) => {
    if (blurredCanvasesRef.current.has(strength)) {
      return blurredCanvasesRef.current.get(strength);
    }

    const canvas = canvasRef.current;
    const image = imageRef.current;
    if (!canvas || !image) throw new Error("The image is not ready yet.");
    const blurredCanvas = document.createElement("canvas");
    blurredCanvas.width = canvas.width;
    blurredCanvas.height = canvas.height;
    const blurredContext = blurredCanvas.getContext("2d");
    if (!blurredContext) {
      throw new Error("Your browser could not prepare this image for blur.");
    }

    if (typeof blurredContext.filter === "string") {
      blurredContext.filter = `blur(${strength}px)`;
      blurredContext.drawImage(image, 0, 0, canvas.width, canvas.height);
      blurredContext.filter = "none";
    } else {
      const scale = Math.max(0.06, 1 / (1 + strength / 4));
      const smallCanvas = document.createElement("canvas");
      smallCanvas.width = Math.max(1, Math.round(canvas.width * scale));
      smallCanvas.height = Math.max(1, Math.round(canvas.height * scale));
      const smallContext = smallCanvas.getContext("2d");
      if (!smallContext) {
        throw new Error("Your browser could not prepare this image for blur.");
      }
      smallContext.drawImage(image, 0, 0, smallCanvas.width, smallCanvas.height);
      blurredContext.imageSmoothingEnabled = true;
      blurredContext.imageSmoothingQuality = "high";
      blurredContext.drawImage(smallCanvas, 0, 0, canvas.width, canvas.height);
    }

    if (blurredCanvasesRef.current.size >= MAX_CACHED_BLURS) {
      const oldestStrength = blurredCanvasesRef.current.keys().next().value;
      blurredCanvasesRef.current.delete(oldestStrength);
    }
    blurredCanvasesRef.current.set(strength, blurredCanvas);
    return blurredCanvas;
  };

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

  const applyStrokeSegment = (context, stroke) => {
    try {
      paintBlurStroke(
        context,
        stroke,
        getBlurredCanvas(stroke.strength),
        maskCanvasRef.current,
        overlayCanvasRef.current,
      );
    } catch (blurError) {
      setError(blurError.message || "Could not blur this image area.");
      drawingRef.current = false;
      activeStrokeRef.current = null;
    }
  };

  const handlePointerDown = (event) => {
    if (isLoading || isApplying || error) return;
    event.preventDefault();
    const point = getCanvasPoint(event);
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");
    if (!point || !context) return;

    drawingRef.current = true;
    canvas.setPointerCapture?.(event.pointerId);
    activeStrokeRef.current = {
      size: brushSize,
      strength: blurStrength,
      points: [point],
    };
    applyStrokeSegment(context, activeStrokeRef.current);
    setHasEdits(true);
  };

  const handlePointerMove = (event) => {
    if (!drawingRef.current || !activeStrokeRef.current) return;
    event.preventDefault();
    const point = getCanvasPoint(event);
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");
    if (!point || !context) return;

    const activeStroke = activeStrokeRef.current;
    activeStroke.points.push(point);
    applyStrokeSegment(context, {
      size: activeStroke.size,
      strength: activeStroke.strength,
      points: [activeStroke.points[activeStroke.points.length - 2], point],
    });
  };

  const finishStroke = () => {
    if (!drawingRef.current) return;
    drawingRef.current = false;
    if (activeStrokeRef.current) {
      strokesRef.current.push(activeStrokeRef.current);
      activeStrokeRef.current = null;
    }
    setCanUndo(strokesRef.current.length > 0);
  };

  const redrawImage = () => {
    const canvas = canvasRef.current;
    const image = imageRef.current;
    const context = canvas?.getContext("2d");
    if (!canvas || !image || !context) return;

    context.clearRect(0, 0, canvas.width, canvas.height);
    context.drawImage(image, 0, 0, canvas.width, canvas.height);
    strokesRef.current.forEach((stroke) =>
      paintBlurStroke(
        context,
        stroke,
        getBlurredCanvas(stroke.strength),
        maskCanvasRef.current,
        overlayCanvasRef.current,
      ),
    );
  };

  const undoLastStroke = () => {
    if (!strokesRef.current.length) return;
    strokesRef.current.pop();
    redrawImage();
    setCanUndo(strokesRef.current.length > 0);
    setHasEdits(strokesRef.current.length > 0);
  };

  const resetImage = () => {
    strokesRef.current = [];
    activeStrokeRef.current = null;
    drawingRef.current = false;
    redrawImage();
    setCanUndo(false);
    setHasEdits(false);
    setError("");
  };

  const applyImage = async () => {
    if (isLoading || error || isApplying) return;
    setIsApplying(true);
    setError("");

    try {
      let editedFile = file;
      if (hasEdits) {
        const canvas = canvasRef.current;
        const blob = await new Promise((resolve) =>
          canvas?.toBlob(resolve, "image/png"),
        );
        if (!blob) throw new Error("Could not prepare the edited image.");
        const baseName = file.name.replace(/\.[^.]+$/, "") || "product-image";
        editedFile = new File([blob], `${baseName}-blurred.png`, {
          type: "image/png",
        });
      }
      await onApply(editedFile);
    } catch (applyError) {
      setError(applyError.message || "Could not prepare this image.");
      setIsApplying(false);
    }
  };

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
              Blur product image
            </h2>
            <p className="mt-1 text-xs text-gray-500">
              Brush over areas to soften details with a natural blur.
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
            onPointerUp={finishStroke}
            onPointerCancel={finishStroke}
            className="block max-h-[54vh] max-w-full touch-none cursor-crosshair object-contain sm:max-h-[62vh]"
            aria-label="Image editing canvas. Drag to blur areas."
          />
        </div>

        <div className="space-y-3 border-t border-gray-100 px-4 py-3 sm:px-6 sm:py-4">
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
            <label className="flex min-w-[180px] flex-1 items-center gap-3 text-xs font-bold text-gray-600">
              <span className="shrink-0">Brush size: {brushSize}px</span>
              <input
                type="range"
                min="20"
                max="300"
                step="10"
                value={brushSize}
                onChange={(event) => setBrushSize(Number(event.target.value))}
                disabled={isLoading || isApplying || Boolean(error)}
                aria-label="Blur brush size"
                className="h-2 min-w-20 flex-1 accent-gray-900"
              />
            </label>
            <label className="flex min-w-[180px] flex-1 items-center gap-3 text-xs font-bold text-gray-600">
              <span className="shrink-0">Blur strength: {blurStrength}px</span>
              <input
                type="range"
                min="2"
                max="32"
                step="2"
                value={blurStrength}
                onChange={(event) => setBlurStrength(Number(event.target.value))}
                disabled={isLoading || isApplying || Boolean(error)}
                aria-label="Blur strength"
                className="h-2 min-w-20 flex-1 accent-gray-900"
              />
            </label>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={undoLastStroke}
                disabled={!canUndo || isApplying}
                className="inline-flex items-center gap-2 rounded-lg border border-gray-200 px-3 py-2 text-xs font-bold text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
              >
                <FiRotateCcw className="h-4 w-4" /> Undo
              </button>
              <button
                type="button"
                onClick={resetImage}
                disabled={!hasEdits || isApplying}
                className="inline-flex items-center gap-2 rounded-lg border border-gray-200 px-3 py-2 text-xs font-bold text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
              >
                <FiTrash2 className="h-4 w-4" /> Reset
              </button>
            </div>
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

export default ImageBlurEditor;
