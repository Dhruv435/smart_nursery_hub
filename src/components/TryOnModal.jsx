import React, { useRef, useState, useEffect, useCallback } from "react";
import Webcam from "react-webcam";
import { X, Camera, Move, Maximize2, RefreshCw, Layers, Check, Zap, ZoomIn } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const TryOnModal = ({ product, onClose }) => {
  const webcamRef = useRef(null);
  const canvasRef = useRef(null); 
  
  // State
  const [selectedPlant, setSelectedPlant] = useState(product.images[0]);
  const [processedPlant, setProcessedPlant] = useState(null); // Transparent version
  const [useTransparent, setUseTransparent] = useState(true); // Toggle state
  
  // AR Transform State
  const [position, setPosition] = useState({ x: 0, y: 0 }); 
  const [scale, setScale] = useState(1); 
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [capturedImage, setCapturedImage] = useState(null); 

  // --- 1. Client-Side Background Removal (Basic) ---
  useEffect(() => {
    const img = new Image();
    img.crossOrigin = "Anonymous";
    img.src = selectedPlant;
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0);
      
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;
      
      // Remove white/near-white pixels
      for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];
        // Threshold: RGB > 230 is considered white
        if (r > 230 && g > 230 && b > 230) {
          data[i + 3] = 0; // Alpha = 0
        }
      }
      ctx.putImageData(imageData, 0, 0);
      setProcessedPlant(canvas.toDataURL());
    };
  }, [selectedPlant]);

  // --- 2. INTERACTION HANDLERS (Fixed Zoom) ---

  const handlePointerDown = (e) => {
    e.preventDefault(); // Stop browser processing
    e.stopPropagation();
    setIsDragging(true);
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    setDragStart({ x: clientX - position.x, y: clientY - position.y });
  };

  const handlePointerMove = (e) => {
    if (!isDragging) return;
    e.preventDefault();
    e.stopPropagation();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    setPosition({
      x: clientX - dragStart.x,
      y: clientY - dragStart.y
    });
  };

  const handlePointerUp = () => {
    setIsDragging(false);
  };

  // Zoom with Wheel (Desktop)
  const handleWheel = (e) => {
    e.stopPropagation(); // Stop parent scroll
    // Only zoom if hovering over the container (which we are)
    const delta = e.deltaY * -0.001;
    const newScale = Math.min(Math.max(0.3, scale + delta), 3);
    setScale(newScale);
  };

  // --- 3. CAPTURE ---
  const handleCapture = useCallback(() => {
    const video = webcamRef.current.video;
    const canvas = canvasRef.current;
    
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext("2d");

    // 1. Draw Camera
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    // 2. Draw Plant
    const imgToDraw = useTransparent ? processedPlant : selectedPlant;
    if (imgToDraw) {
        const img = new Image();
        img.src = imgToDraw;
        
        // Scale logic to match visual to canvas
        const containerW = video.clientWidth;
        const containerH = video.clientHeight;
        const scaleX = canvas.width / containerW;
        const scaleY = canvas.height / containerH;

        const plantW = (img.width * 0.5) * scale * scaleX; 
        const plantH = (img.height * 0.5) * scale * scaleY;
        
        // Center + Offset
        const drawX = (canvas.width/2) + (position.x * scaleX) - (plantW/2);
        const drawY = (canvas.height/2) + (position.y * scaleY) - (plantH/2);

        ctx.drawImage(img, drawX, drawY, plantW, plantH);
    }
    setCapturedImage(canvas.toDataURL("image/jpeg"));
  }, [webcamRef, processedPlant, selectedPlant, position, scale, useTransparent]);


  return (
    // Fixed container with touch-none to prevent browser zooming/scrolling
    <div className="fixed inset-0 z-[100] bg-black touch-none overflow-hidden flex flex-col font-sans">
      
      {/* 1. TOP BAR */}
      <div className="absolute top-0 left-0 right-0 p-6 z-30 flex justify-between items-start bg-gradient-to-b from-black/60 to-transparent pt-8">
        <div>
            <div className="flex items-center gap-2 mb-1">
                <span className="bg-emerald-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider animate-pulse">Live AR</span>
                <h3 className="text-white font-bold text-xl drop-shadow-md font-serif">Visualiser</h3>
            </div>
            <p className="text-white/80 text-xs font-medium backdrop-blur-sm bg-black/20 px-2 py-1 rounded-lg inline-block">
               Drag to place • Scroll to resize
            </p>
        </div>
        <button 
            onClick={onClose} 
            className="bg-white/10 p-3 rounded-full text-white backdrop-blur-md border border-white/20 hover:bg-white/20 transition-all active:scale-95"
        >
          <X size={20} />
        </button>
      </div>

      {/* 2. MAIN AR AREA */}
      <div 
        className="relative flex-1 flex items-center justify-center bg-stone-900 overflow-hidden"
        onWheel={!capturedImage ? handleWheel : undefined} // Attach wheel here
      >
        <AnimatePresence>
        {!capturedImage ? (
            <>
                {/* WEBCAM */}
                <Webcam
                    ref={webcamRef}
                    audio={false}
                    screenshotFormat="image/jpeg"
                    className="absolute w-full h-full object-cover"
                    videoConstraints={{ facingMode: "environment" }}
                />

                {/* DRAGGABLE PLANT LAYER */}
                <div
                    onMouseDown={handlePointerDown}
                    onTouchStart={handlePointerDown}
                    // Attach move/up listeners to window to catch drags outside element
                    ref={(node) => {
                        if (node) {
                            window.addEventListener('mousemove', handlePointerMove);
                            window.addEventListener('mouseup', handlePointerUp);
                            window.addEventListener('touchmove', handlePointerMove, { passive: false });
                            window.addEventListener('touchend', handlePointerUp);
                        }
                        return () => {
                            window.removeEventListener('mousemove', handlePointerMove);
                            window.removeEventListener('mouseup', handlePointerUp);
                            window.removeEventListener('touchmove', handlePointerMove);
                            window.removeEventListener('touchend', handlePointerUp);
                        };
                    }}
                    style={{
                        transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
                        cursor: isDragging ? "grabbing" : "grab",
                        position: 'absolute',
                        zIndex: 20,
                        touchAction: 'none' // Critical for preventing scroll on drag
                    }}
                    className="select-none"
                >
                    <img 
                        src={useTransparent ? processedPlant : selectedPlant} 
                        alt="AR Plant" 
                        className="w-64 h-auto drop-shadow-[0_20px_50px_rgba(0,0,0,0.5)] pointer-events-none" 
                    />
                    
                    {/* Bounding Box (Visual Feedback) */}
                    <div className={`absolute inset-0 border-2 border-white/50 border-dashed rounded-xl pointer-events-none transition-opacity duration-300 ${isDragging ? "opacity-100" : "opacity-0"}`}>
                        <div className="absolute -top-3 -right-3 bg-emerald-500 text-white p-1 rounded-full shadow-sm">
                            <Move size={12}/>
                        </div>
                    </div>
                </div>
            </>
        ) : (
            // REVIEW MODE
            <motion.img 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                src={capturedImage} 
                alt="Captured" 
                className="w-full h-full object-contain bg-black" 
            />
        )}
        </AnimatePresence>
      </div>

      {/* 3. CONTROLS (Bottom) */}
      <div className="absolute bottom-0 left-0 right-0 p-6 pb-8 bg-gradient-to-t from-black/90 via-black/50 to-transparent z-30">
        
        {!capturedImage && (
            <div className="flex flex-col gap-6 max-w-md mx-auto w-full">
                
                {/* Toggle Background Button */}
                <div className="flex justify-center">
                    <button 
                        onClick={() => setUseTransparent(!useTransparent)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold border transition-all ${
                            useTransparent 
                            ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/50 backdrop-blur-md" 
                            : "bg-white/10 text-white border-white/20 backdrop-blur-md"
                        }`}
                    >
                        <Layers size={14} />
                        {useTransparent ? "Background Removed" : "Original Image"}
                    </button>
                </div>

                {/* Plant Selector */}
                <div className="flex gap-3 overflow-x-auto pb-2 justify-center scrollbar-hide">
                    {product.images.map((img, idx) => (
                        <div 
                            key={idx}
                            onClick={() => {
                                setSelectedPlant(img);
                                // Optional: Reset pos on switch
                                // setPosition({x:0, y:0}); 
                            }}
                            className={`relative w-16 h-16 rounded-2xl overflow-hidden cursor-pointer transition-all duration-300 ${
                                selectedPlant === img 
                                ? "ring-2 ring-emerald-500 ring-offset-2 ring-offset-black scale-110 opacity-100" 
                                : "opacity-50 hover:opacity-100"
                            }`}
                        >
                            <img src={img} className="w-full h-full object-cover" alt="variant" />
                            {selectedPlant === img && (
                                <div className="absolute inset-0 bg-emerald-500/20"></div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        )}

        {/* Action Buttons */}
        <div className="flex items-center justify-center gap-8 mt-6">
            {!capturedImage ? (
                <>
                    <button 
                        onClick={handleCapture}
                        className="group relative w-20 h-20 rounded-full border-4 border-white flex items-center justify-center active:scale-95 transition-all shadow-[0_0_40px_rgba(255,255,255,0.3)]"
                    >
                        <div className="w-16 h-16 bg-white rounded-full group-hover:scale-90 transition-transform duration-300"></div>
                        <Camera className="absolute text-stone-300 opacity-0 group-hover:opacity-100 transition-opacity" size={24}/>
                    </button>
                </>
            ) : (
                <div className="flex gap-4 w-full max-w-sm mx-auto">
                    <button 
                        onClick={() => setCapturedImage(null)}
                        className="flex-1 bg-white/10 backdrop-blur-md border border-white/20 text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-white/20 transition-all active:scale-95"
                    >
                        <RefreshCw size={18} /> Retake
                    </button>
                    <button 
                        onClick={onClose}
                        className="flex-1 bg-emerald-600 text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-emerald-900/50 hover:bg-emerald-500 transition-all active:scale-95"
                    >
                        <Check size={18} /> Save & Close
                    </button>
                </div>
            )}
        </div>
      </div>

      {/* Hidden Canvas */}
      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
};

export default TryOnModal;