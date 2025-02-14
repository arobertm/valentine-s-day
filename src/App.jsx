import './App.css';
import { useState, useEffect, Suspense, lazy } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseAnonKey);


const LazyImage = lazy(() => import("./LazyImage"));

function App() {
  const [selectedImage, setSelectedImage] = useState(null);
  const [memories, setMemories] = useState([]);
  const [loading, setLoading] = useState(true);

  const messages = [
    {
      date: 'Robert',
      text: 'Nu există cuvinte să descriu cât de specială ești pentru mine. Te iubesc la infinit! 💝'
    },
    {
      date: 'Paula(e supi)',
      text: 'Mersi, la fel! 💝'
    },
  ];

  useEffect(() => {
    const fetchImages = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase.storage.from("photos").list("", {
          limit: 100,
          offset: 0,
          sortBy: { column: "name", order: "asc" }
        });
    
        console.log("📸 Supabase response:", data);
    
        if (error) {
          console.error("🚨 Eroare la fetch-ul imaginilor:", error);
          setLoading(false);
          return;
        }
    
        if (!data || data.length === 0) {
          console.warn("⚠️ Nu există imagini în Supabase.");
          setLoading(false);
          return;
        }
    
        const validFiles = data.filter(file => file.name && /\.(jpg|jpeg|png)$/i.test(file.name));
        console.log("✅ Fișiere valide:", validFiles.length); 

        const uniqueFiles = [...new Map(validFiles.map(file => [file.name, file])).values()];
        console.log("✅ Fișiere unice după eliminarea duplicatelor:", uniqueFiles.length);
    
        const imagesList = await Promise.all(
          uniqueFiles.map(async (file) => {
            const { data: signedUrlData, error: signedUrlError } = await supabase
              .storage
              .from("photos")
              .createSignedUrl(file.name, 60 * 60);
    
            if (signedUrlError) {
              console.error(`🚨 Eroare la generarea URL-ului semnat pentru ${file.name}:`, signedUrlError);
              return null;
            }
    
            console.log("✅ URL semnat generat pentru:", file.name, signedUrlData.signedUrl);
    
            const isPortrait = file.name.toLowerCase().includes("portrait") || file.name.match(/(IMG|img)_\d{8}_\d{6}/);
    
            return {
              date: "14 Februarie 2024",
              image: signedUrlData.signedUrl,
              message: `Un moment special împreună ❤️`,
              isPortrait: isPortrait
            };
          })
        );
    
        console.log("🎯 Imagini finale după procesare:", imagesList.length);
    
      } catch (error) {
        console.error("🚨 Eroare la fetch:", error);
      } finally {
        setLoading(false);
      }
    };
    

    fetchImages();
  }, []);

  const handleImageClick = (image) => {
    setSelectedImage(image);
  };

  const closeExpandedView = () => {
    setSelectedImage(null);
  };

  return (
    <div className="dashboard">
      <div className="animated-bg"></div>
      <div className="content-wrapper">
        <div className="main-title">
          <h1>
            Te iubesc, <span className="handwritten">Paula</span>
          </h1>
        </div>

        <div className="main-container">
          <div className="dashboard-layout">
            <div className="sidebar">
              <section className="messages-section">
                <h2 className="section-title">Mesaje din Inimă</h2>
                {messages.map((message, index) => (
                  <div key={index} className="message-card">
                    <div className="message-header">
                      <span className="heart">❤️</span>
                      <span className="message-date">{message.date}</span>
                    </div>
                    <p className="message-text">{message.text}</p>
                  </div>
                ))}
              </section>
            </div>

            <div className="main-content">
              <h2 className="section-title">Momente Importante</h2>

              {/* Loader dacă imaginile se încarcă */}
              {loading ? (
                <p className="loading">⏳ Se încarcă imaginile...</p>
              ) : (
                <div className="thumbnails-grid">
                  {memories.map((memory, index) => (
                    <div
                      key={index}
                      className={`thumbnail-card ${memory.isPortrait ? 'portrait' : 'landscape'}`}
                      onClick={() => handleImageClick(memory)}
                    >
                      <Suspense fallback={<p>Loading...</p>}>
                        <LazyImage src={memory.image} alt={`Memory ${index + 1}`} />
                      </Suspense>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Vizualizare extinsă a imaginii */}
        <div
          className={`expanded-view ${selectedImage ? 'active' : ''}`}
          onClick={closeExpandedView}
        >
          {selectedImage && (
            <img
              src={selectedImage.image}
              loading="lazy"
              alt={selectedImage.message}
              className="expanded-image"
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
