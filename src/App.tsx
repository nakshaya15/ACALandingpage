import React, { useState, type ChangeEvent, type FormEvent } from "react";

interface FormData {
  name: string;
  mobile: string;
  email: string;
  logo: File | null;
  insta: string;
  youtube: string;
  website: string;
}

interface VideoAd {
  id: number;
  src: string;
}

interface Poster {
  id: number;
  image: string;
}

const LandingPage: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    mobile: "",
    email: "",
    logo: null,
    insta: "",
    youtube: "",
    website: "",
  });

  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  
  // 1. New state for fullscreen video source
  const [fullscreenVideoSrc, setFullscreenVideoSrc] = useState<string | null>(null);

  const fileToBase64 = (file: File): Promise<string> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        if (typeof reader.result === "string") {
          const base64Data = reader.result.split(",")[1];
          resolve(base64Data);
        } else reject("File conversion failed");
      };
      reader.onerror = (err) => reject(err);
    });

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value, files } = e.target;
    if (name === "logo" && files && files[0]) {
      setFormData({ ...formData, logo: files[0] });
      setLogoPreview(URL.createObjectURL(files[0]));
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleOkClick = () => {
    // This will refresh the page, clearing all form data and state
    window.location.reload();
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const mobileRegex = /^[0-9]{10}$/;
    if (!mobileRegex.test(formData.mobile)) {
      alert("Please enter a valid 10-digit mobile number ❌");
      return;
    }

    setLoading(true);
    setShowModal(false);

    try {
      let logoBase64 = "";
      if (formData.logo) logoBase64 = await fileToBase64(formData.logo);

      await fetch(
        "https://script.google.com/macros/s/AKfycbyWtlls_SjcOiNkSBmF2LMXmnG3a5XwiFfXi54Tkr191JndhuLRbGJIZ-6hYMU3_sNgMg/exec",
        {
          method: "POST",
          mode: "no-cors",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: formData.name,
            mobile: formData.mobile,
            email: formData.email,
            insta: formData.insta,
            youtube: formData.youtube,
            website: formData.website,
            logo: logoBase64,
          }),
        }
      );

      setLoading(false);
      setShowModal(true);
    } catch (error) {
      console.error(error);
      alert("Something went wrong ❌");
      setLoading(false);
    }
  };
  
  // 2. Function to open the fullscreen view
  const openFullscreenVideo = (src: string) => {
    setFullscreenVideoSrc(src);
  };
  
  // 3. Function to close the fullscreen view
  const closeFullscreenVideo = () => {
    setFullscreenVideoSrc(null);
  };

  const videoAds: VideoAd[] = [
    { id: 1, src: "/video1.mp4" },
    { id: 2, src: "/video2.mp4" },
    { id: 3, src: "/video3.mp4" },
    { id: 4, src: "/video4.mp4" },
    { id: 5, src: "/video6.mp4" },
    { id: 6, src: "/video7.mp4" },
  ];

  const posters: Poster[] = [
    { id: 1, image: "/image.jpeg" },
    { id: 2, image: "/image2.jpeg" },
    { id: 3, image: "/image3.jpeg" },
  ];

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      {/* Header */}
      <nav className="bg-gray-800 shadow-md p-4 flex justify-center items-center">
        <div className="text-2xl font-bold text-indigo-500">AKSHAYA  CREATIVE  ADS</div>
      </nav>

      <main className="p-6 space-y-12">
        {/* Video Ads Section */}
        <section>
          <h2 className="text-2xl font-semibold mb-4">Our ACA Video Ads</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {videoAds.map((video) => (
              <div
                key={video.id}
                className="bg-gray-800 shadow rounded-lg overflow-hidden transition-transform duration-300 hover:scale-105 cursor-pointer"
                onClick={() => openFullscreenVideo(video.src)}
              >
                <video
                  src={video.src}
                  autoPlay
                  loop
                  muted
                  className="w-full h-48 object-cover pointer-events-none"
                />
              </div>
            ))}
          </div>
        </section>

        {/* Posters Section */}
        <section>
          <h2 className="text-2xl font-semibold mb-4">Our Posters</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {posters.map((poster) => (
              <div key={poster.id} className="bg-gray-800 shadow rounded-lg overflow-hidden transition-transform duration-300 hover:scale-105">
                <img
                  src={poster.image}
                  alt=""
                  className="w-full h-48 object-cover"
                  onContextMenu={(e) => e.preventDefault()}
                />
              </div>
            ))}
          </div>
        </section>

        {/* Registration Section */}
        <section className="bg-gray-800 p-6 rounded-xl shadow-md max-w-xl mx-auto relative">
          {loading ? (
            <div className="flex flex-col items-center justify-center p-12">
              <svg className="animate-spin h-16 w-16 text-indigo-500 mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <p className="text-lg text-white">Processing...</p>
            </div>
          ) : (
            <>
              <h2 className="text-2xl font-semibold mb-4 text-center">Get Your Ad For Free</h2>
              <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <input
                  type="text"
                  name="name"
                  placeholder="Name"
                  value={formData.name}
                  onChange={handleChange}
                  className="p-2 border rounded bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                  required
                />
                <input
                  type="text"
                  name="mobile"
                  placeholder="Mobile"
                  value={formData.mobile}
                  onChange={handleChange}
                  className="p-2 border rounded bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                  required
                />
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={handleChange}
                  className="p-2 border rounded bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                />
                <div className="sm:col-span-2">
                  <label htmlFor="logo-upload" className="block text-sm font-medium text-gray-400 mb-1">
                    Logo (Mandatory)
                  </label>
                  <input
                    id="logo-upload"
                    type="file"
                    name="logo"
                    onChange={handleChange}
                    className="p-2 border rounded w-full bg-gray-700 border-gray-600 text-white file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                    required
                  />
                  {logoPreview && (
                    <img
                      src={logoPreview}
                      alt="Logo Preview"
                      className="mt-2 w-32 h-32 object-contain border-2 border-indigo-500 rounded-md"
                    />
                  )}
                </div>
                <input
                  type="text"
                  name="insta"
                  placeholder="Instagram Link"
                  value={formData.insta}
                  onChange={handleChange}
                  className="p-2 border rounded bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                />
                <input
                  type="text"
                  name="youtube"
                  placeholder="YouTube Link"
                  value={formData.youtube}
                  onChange={handleChange}
                  className="p-2 border rounded bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                />
                <input
                  type="text"
                  name="website"
                  placeholder="Website Link"
                  value={formData.website}
                  onChange={handleChange}
                  className="p-2 border rounded bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                />
                <button
                  type="submit"
                  className="sm:col-span-2 bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700 transition"
                >
                  Register
                </button>
              </form>
            </>
          )}

          {/* Offer Details */}
          <div className="mt-6 bg-white py-4 rounded-xl shadow-lg text-center border-2 border-indigo-600 max-w-sm mx-auto">
            <h1 className="font-bold text-2xl text-indigo-700">Our Offer Price:</h1>
            <p className="text-gray-900 mt-4">5 Hollywood Style Video Ads</p>
            <p className="text-gray-900">5 Hollywood Style Posters</p>
            <p className="mt-4 font-bold text-2xl text-red-600 animate-pulse">Just: 15K / month</p>
            <p className="text-gray-900 mt-2">Contact: 824-7707-851</p>
          </div>
        </section>
      </main>

      {/* Success Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-75 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-8 shadow-xl text-center max-w-sm w-full transform transition-all duration-300 scale-100">
            <svg className="h-20 w-20 text-green-500 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h3 className="text-2xl leading-6 font-medium text-gray-900 mb-2">Registration Successful!</h3>
            <p className="text-sm text-gray-500">We will contact you shortly.</p>
            <div className="mt-4">
              <button
                type="button"
                className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 transition"
                onClick={handleOkClick}
              >
                OK
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* 4. Fullscreen Video Modal/Lightbox */}
      {fullscreenVideoSrc && (
        <div
          className="fixed inset-0 bg-black bg-opacity-95 flex items-center justify-center p-4 z-50"
          onClick={closeFullscreenVideo} // Close when clicking outside the video
        >
          <div className="relative max-w-4xl max-h-full w-full h-full" onClick={(e) => e.stopPropagation()}>
            {/* Close button */}
            <button
              onClick={closeFullscreenVideo}
              className="absolute top-4 right-4 text-white text-3xl font-bold z-50 p-2 bg-gray-800 rounded-full hover:bg-gray-700 transition"
              aria-label="Close video"
            >
              &times;
            </button>
            
            {/* The actual video player */}
            <video
              src={fullscreenVideoSrc}
              controls // Add controls for play/pause, volume, etc.
              autoPlay // Start playing automatically
              loop
              className="w-full h-full object-contain" // object-contain ensures the video fits within the modal without cropping
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default LandingPage;