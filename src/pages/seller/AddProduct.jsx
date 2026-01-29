import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import Cropper from "react-easy-crop";
import { motion, AnimatePresence } from "framer-motion";
import { 
  X, Image as ImageIcon, UploadCloud, ChevronRight, 
  PenTool, Save, Loader2, Crop, Sparkles, Zap, ShieldCheck 
} from "lucide-react";

// --- CONSTANTS ---
const CATEGORY_MAP = {
  Indoor: ["Small", "Medium", "Large"],
  Outdoor: ["Small", "Medium", "Large"],
  Succulent: ["Small", "Medium"],
  Flowering: ["Small", "Medium", "Large"],
  Seeds: ["Packet", "Bag"],
};

// --- STYLING CONSTANTS ---
const LABEL_CLASS = "text-[10px] font-black uppercase tracking-[0.3em] text-stone-400 mb-3 block group-focus-within:text-emerald-600 transition-colors";
const INPUT_CLASS = "w-full bg-transparent border-b border-stone-200 py-3 focus:outline-none focus:border-emerald-600 transition-all font-serif text-xl placeholder:text-stone-200 text-stone-800";

const PremiumInput = (props) => (
  <div className="group space-y-1">
    <label className={LABEL_CLASS}>{props.label}</label>
    <div className="relative">
      <input {...props} className={INPUT_CLASS} />
    </div>
  </div>
);

const PremiumSelect = ({ label, children, ...props }) => (
  <div className="group space-y-1">
    <label className={LABEL_CLASS}>{label}</label>
    <div className="relative border-b border-stone-200 group-focus-within:border-emerald-500 transition-all">
      <select {...props} className={`${INPUT_CLASS} appearance-none pr-8 cursor-pointer border-none`}>
        {children}
      </select>
      <ChevronRight className="absolute right-0 top-1/2 -translate-y-1/2 text-stone-300 group-focus-within:text-emerald-500 rotate-90" size={16} />
    </div>
  </div>
);

// --- HELPERS ---
const fileToBase64 = (file) => new Promise((resolve, reject) => {
  const reader = new FileReader();
  reader.onload = () => resolve(reader.result);
  reader.onerror = reject;
  reader.readAsDataURL(file);
});

const urlToBase64 = async (url) => {
  try {
    if (url.startsWith("data:")) return url;
    const response = await fetch(url);
    const blob = await response.blob();
    return await fileToBase64(blob);
  } catch (e) { return url; }
};

const compressImage = (file, maxWidth = 1200, quality = 0.85) => new Promise((resolve) => {
  const reader = new FileReader();
  reader.onload = (e) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      let width = img.width, height = img.height;
      if (width > height && width > maxWidth) { height = (height * maxWidth) / width; width = maxWidth; }
      else if (height > maxWidth) { width = (width * maxWidth) / height; height = maxWidth; }
      canvas.width = width; canvas.height = height;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0, width, height);
      canvas.toBlob((blob) => resolve(blob), "image/jpeg", quality);
    };
    img.src = e.target.result;
  };
  reader.readAsDataURL(file);
});

const getCroppedImg = async (imageSrc, pixelCrop) => {
  const image = new Image();
  image.src = imageSrc;
  await new Promise((resolve) => (image.onload = resolve));
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  canvas.width = pixelCrop.width; canvas.height = pixelCrop.height;
  ctx.drawImage(image, pixelCrop.x, pixelCrop.y, pixelCrop.width, pixelCrop.height, 0, 0, pixelCrop.width, pixelCrop.height);
  return new Promise((resolve) => canvas.toBlob((blob) => resolve(blob), "image/jpeg", 0.9));
};

export default function AddProduct({ setActiveTab, editingProduct, setEditingProduct, refreshData }) {
  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Indoor");
  const [subcategory, setSubcategory] = useState("Small");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [productImages, setProductImages] = useState([]);
  const [productImagePreviews, setProductImagePreviews] = useState([]);
  const [thumbnailImage, setThumbnailImage] = useState(null);
  const [thumbnailPreview, setThumbnailPreview] = useState(null);
  const [cropModalOpen, setCropModalOpen] = useState(false);
  const [imageToCrop, setImageToCrop] = useState(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [croppedFileIndex, setCroppedFileIndex] = useState(null);

  const subcategories = useMemo(() => CATEGORY_MAP[category] || [], [category]);

  useEffect(() => {
    if (editingProduct) {
      setTitle(editingProduct.name);
      setCategory(editingProduct.category);
      setSubcategory(editingProduct.subcategory);
      setPrice(editingProduct.price);
      setDescription(editingProduct.description);
      setProductImages(editingProduct.images || []);
      setProductImagePreviews(editingProduct.images || []);
      if(editingProduct.thumbnail) {
          setThumbnailImage(editingProduct.thumbnail);
          setThumbnailPreview(editingProduct.thumbnail);
      }
    } else { resetForm(); }
  }, [editingProduct]);

  useEffect(() => {
    if (subcategories.length > 0 && !editingProduct) setSubcategory(subcategories[0]);
  }, [category, editingProduct, subcategories]);

  const handleProductImagesChange = async (e) => {
    const files = Array.from(e.target.files);
    const processedImages = [];
    for (const file of files) {
      const compressedBlob = await compressImage(file);
      const base64 = await fileToBase64(compressedBlob);
      processedImages.push(base64);
    }
    setProductImages([...productImages, ...processedImages]);
    setProductImagePreviews([...productImagePreviews, ...processedImages]);
  };

  const handleThumbnailChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const compressedBlob = await compressImage(file);
    const base64 = await fileToBase64(compressedBlob);
    setThumbnailImage(base64);
    setThumbnailPreview(base64);
  };

  const openCropper = (index) => {
    setCroppedFileIndex(index);
    setImageToCrop(productImagePreviews[index]);
    setCrop({ x: 0, y: 0 });
    setZoom(1);
    setCropModalOpen(true);
  };

  const onCropComplete = (croppedArea, croppedAreaPixels) => { setCroppedAreaPixels(croppedAreaPixels); };

  const applyCrop = async () => {
    if (!imageToCrop || croppedFileIndex === null || !croppedAreaPixels) return;
    try {
      const croppedBlob = await getCroppedImg(imageToCrop, croppedAreaPixels);
      const base64 = await fileToBase64(croppedBlob);
      const newImages = [...productImages]; newImages[croppedFileIndex] = base64; setProductImages(newImages);
      const newPreviews = [...productImagePreviews]; newPreviews[croppedFileIndex] = base64; setProductImagePreviews(newPreviews);
      setCropModalOpen(false);
    } catch (error) { alert("Failed to crop image"); }
  };

  const removeProductImage = (i) => {
    setProductImages(productImages.filter((_, idx) => idx !== i));
    setProductImagePreviews(productImagePreviews.filter((_, idx) => idx !== i));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !price || !description) return alert("Please fill all required fields");
    if (productImages.length === 0 && !editingProduct) return alert("Please add at least one image");
    setLoading(true);
    try {
      const seller = JSON.parse(localStorage.getItem("seller"));
      const finalImages = await Promise.all(productImages.map(img => urlToBase64(img)));
      const finalThumbnail = thumbnailImage ? await urlToBase64(thumbnailImage) : null;
      const payload = { sellerId: seller._id, name: title, category, subcategory, price, description, images: finalImages, thumbnail: finalThumbnail };
      const url = editingProduct ? `https://nursreyhubbackend.vercel.app/update-product/${editingProduct._id}` : "https://nursreyhubbackend.vercel.app/add-product";
      const method = editingProduct ? "put" : "post";
      await axios({ url, method, data: payload, headers: { "Content-Type": "application/json" } });
      alert("Success!");
      if(refreshData) refreshData();
      if(setEditingProduct) setEditingProduct(null);
      resetForm(); setActiveTab("my-products");
    } catch (err) { alert("Operation failed."); } finally { setLoading(false); }
  };

  function resetForm() {
    setTitle(""); setCategory("Indoor"); setSubcategory("Small"); setPrice(""); setDescription("");
    setProductImages([]); setProductImagePreviews([]); setThumbnailImage(null); setThumbnailPreview(null);
  }

  return (
    <div className="max-w-[1400px] mx-auto font-sans text-stone-700 pb-20">
      
      {/* ==================== 1. STUDIO HEADER ==================== */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row items-start md:items-end justify-between mb-16 gap-6"
      >
        <div>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-[1px] bg-emerald-600"></div>
            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-emerald-700">Studio Registration</span>
          </div>
          <h2 className="text-5xl md:text-7xl font-serif text-stone-900 leading-none tracking-tighter">
            {editingProduct ? "Modify" : "New"} <span className="italic font-light text-stone-400">Series</span>
          </h2>
        </div>
        {editingProduct && (
          <button onClick={() => {setEditingProduct(null); resetForm(); setActiveTab("my-products");}} className="px-8 py-3 bg-stone-100 rounded-2xl text-[10px] font-black uppercase tracking-widest text-stone-400 hover:bg-stone-200 transition-all">
            Discard Terminal
          </button>
        )}
      </motion.div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-16">
        
        {/* ==================== 2. LEFT: BOTANICAL INTEL ==================== */}
        <div className="lg:col-span-7 space-y-16">
          <div className="bg-white p-10 md:p-16 rounded-[3rem] shadow-2xl shadow-stone-200/40 border border-white">
            <h3 className="text-3xl font-serif text-stone-900 mb-12 flex items-center gap-4">
              <Zap className="text-emerald-500" size={20} /> Nomenclature & Settlement
            </h3>
            
            <div className="space-y-12">
              <PremiumInput label="Plant Nomenclature" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g., Monstera Deliciosa" required />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <PremiumSelect label="Archive Category" value={category} onChange={(e) => setCategory(e.target.value)}>
                  {Object.keys(CATEGORY_MAP).map((c) => <option key={c} value={c}>{c}</option>)}
                </PremiumSelect>
                <PremiumSelect label="Specimen Size" value={subcategory} onChange={(e) => setSubcategory(e.target.value)}>
                  {subcategories.map((sc) => <option key={sc} value={sc}>{sc}</option>)}
                </PremiumSelect>
              </div>

              <div className="group space-y-1">
                <label className={LABEL_CLASS}>Settlement Value (₹)</label>
                <div className="relative border-b border-stone-200 group-focus-within:border-emerald-500 transition-all">
                  <span className="absolute left-0 top-1/2 -translate-y-1/2 text-stone-300 font-serif text-xl">₹</span>
                  <input className={`${INPUT_CLASS} pl-8`} value={price} type="number" step="0.01" onChange={(e) => setPrice(e.target.value)} placeholder="00.00" required />
                </div>
              </div>

              <div className="group space-y-1">
                <label className={LABEL_CLASS}>Curator's Manuscript (Description)</label>
                <textarea 
                  value={description} onChange={(e) => setDescription(e.target.value)} 
                  className={`${INPUT_CLASS} min-h-[160px] resize-none border-stone-100 bg-stone-50/30 p-4 rounded-3xl border focus:border-emerald-500`} 
                  placeholder="Detail the biological health and aesthetic profile of this specimen..." required 
                />
              </div>
            </div>
          </div>
        </div>

        {/* ==================== 3. RIGHT: VISUAL ARCHIVE ==================== */}
        <div className="lg:col-span-5 space-y-12">
          <div className="bg-stone-900 p-10 md:p-12 rounded-[3rem] text-white shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-10"><ImageIcon size={120} /></div>
            
            <h3 className="text-2xl font-serif mb-10 flex items-center gap-3">
              <Sparkles className="text-emerald-400" size={20} /> Visual Profile
            </h3>

            {/* Thumbnail */}
            <div className="mb-10">
              <label className="text-[10px] font-black uppercase tracking-widest text-stone-500 mb-4 block">Primary Portrait</label>
              <div className="flex items-center gap-6">
                 <label className="w-24 h-24 border-2 border-dashed border-stone-700 rounded-3xl flex items-center justify-center cursor-pointer hover:bg-stone-800 transition-all group shrink-0">
                   <UploadCloud className="text-stone-600 group-hover:text-emerald-400" size={20} />
                   <input type="file" accept="image/*" onChange={handleThumbnailChange} className="hidden" />
                 </label>
                 {thumbnailPreview && (
                   <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="flex-1 h-24 bg-stone-800 rounded-3xl overflow-hidden border border-stone-700 shadow-xl">
                     <img src={thumbnailPreview} className="w-full h-full object-cover" alt="thumbnail" />
                   </motion.div>
                 )}
              </div>
            </div>

            {/* Gallery */}
            <div>
              <label className="text-[10px] font-black uppercase tracking-widest text-stone-500 mb-4 block">Series Gallery (Max 10)</label>
              <label className="w-full h-32 border-2 border-dashed border-emerald-500/30 bg-white/5 rounded-[2.5rem] flex flex-col items-center justify-center cursor-pointer hover:bg-white/10 transition-all mb-8">
                <UploadCloud className="text-emerald-400 mb-2" size={24} />
                <span className="text-[10px] font-black uppercase tracking-widest">Inject Media</span>
                <input type="file" multiple accept="image/*" onChange={handleProductImagesChange} className="hidden" />
              </label>

              <div className="grid grid-cols-2 gap-4 max-h-[350px] overflow-y-auto pr-2 custom-scrollbar">
                {productImagePreviews.map((img, i) => (
                  <div key={i} className="relative group aspect-square rounded-[1.5rem] overflow-hidden border border-stone-800 shadow-xl bg-stone-800">
                    <img src={img} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700" alt={`p ${i}`} />
                    <div className="absolute inset-0 bg-stone-950/80 opacity-0 group-hover:opacity-100 transition-all flex flex-col items-center justify-center gap-2 backdrop-blur-sm">
                        <button type="button" onClick={() => openCropper(i)} className="bg-white text-stone-900 px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">Adjust</button>
                        <button type="button" onClick={() => removeProductImage(i)} className="text-red-400 text-[10px] font-black uppercase tracking-widest">Remove</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <motion.button 
            whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
            disabled={loading} 
            className={`w-full py-6 rounded-[2rem] font-black uppercase tracking-[0.4em] text-xs shadow-2xl flex items-center justify-center gap-3 transition-all ${
              loading 
                ? "bg-stone-100 text-stone-400 cursor-not-allowed" 
                : "bg-emerald-600 text-white hover:bg-emerald-500"
            }`}
          >
            {loading ? <Loader2 className="animate-spin" size={18} /> : <><Save size={18} /> {editingProduct ? "Update Archive" : "Publish Specimen"}</>}
          </motion.button>
        </div>
      </form>

      {/* ==================== 4. CROPPER STUDIO ==================== */}
      <AnimatePresence>
        {cropModalOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[120] bg-stone-950/90 backdrop-blur-xl flex justify-center items-center p-6">
            <motion.div initial={{ scale: 0.9, y: 30 }} animate={{ scale: 1, y: 0 }} className="bg-[#faf9f6] rounded-[3rem] w-full max-w-2xl h-[85vh] flex flex-col shadow-2xl overflow-hidden">
              <div className="p-8 border-b border-stone-100 flex justify-between items-center bg-white">
                <h3 className="text-xl font-serif text-stone-900 flex items-center gap-3 font-bold"><Crop size={18}/> Optical Adjustment</h3>
                <button onClick={() => setCropModalOpen(false)} className="w-10 h-10 bg-stone-100 rounded-full flex items-center justify-center text-stone-400"><X size={20}/></button>
              </div>
              <div className="flex-1 relative bg-stone-900"><Cropper image={imageToCrop} crop={crop} zoom={zoom} aspect={1} onCropChange={setCrop} onZoomChange={setZoom} onCropComplete={(a, ap) => setCroppedAreaPixels(ap)} /></div>
              <div className="p-10 space-y-8 bg-white">
                <div className="flex items-center gap-6">
                  <span className="text-[10px] font-black text-stone-400 uppercase tracking-widest">Lens Zoom</span>
                  <input type="range" min={1} max={3} step={0.1} value={zoom} onChange={(e) => setZoom(parseFloat(e.target.value))} className="flex-1 h-1 bg-stone-200 rounded-lg appearance-none cursor-pointer accent-emerald-600" />
                </div>
                <div className="flex gap-4">
                  <button onClick={() => setCropModalOpen(false)} className="flex-1 py-4 text-[10px] font-black uppercase tracking-widest text-stone-400 hover:text-stone-900 transition-colors">Abort</button>
                  <button onClick={applyCrop} className="flex-1 bg-stone-900 text-white py-4 rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-xl">Apply Crop</button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}