"use client";
import { useState, useEffect } from "react";
import HTMLFlipBook from "react-pageflip";

interface FlipbookProps {
  images: string[];
}

export function Flipbook({ images }: FlipbookProps) {
  const [isMobile, setIsMobile] = useState(false);
  const [isSmallMobile, setIsSmallMobile] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768);
      setIsSmallMobile(window.innerWidth < 480);
    };

    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);

    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  if (images.length === 0) return <div>Não há imagens</div>;

  return (
    <div className="flex justify-center items-center w-full min-h-screen p-2 bg-gray-50">
      <div className="flipbook-container">
        <HTMLFlipBook
          width={isMobile ? (isSmallMobile ? 280 : 320) : 900}
          height={isMobile ? (isSmallMobile ? 400 : 450) : 700}
          maxShadowOpacity={0.2}
          drawShadow={!isMobile}
          showCover={true}
          size="stretch"
          className="flipbook"
          style={{
            margin: "0 auto",
            boxShadow: isMobile ? "none" : "0 10px 30px rgba(0,0,0,0.3)",
          }}
          startPage={0}
          minWidth={isMobile ? (isSmallMobile ? 250 : 280) : 700}
          maxWidth={isMobile ? (isSmallMobile ? 320 : 380) : 1400}
          minHeight={isMobile ? (isSmallMobile ? 350 : 400) : 500}
          maxHeight={isMobile ? (isSmallMobile ? 450 : 500) : 900}
          showPageCorners={false}
          disableFlipByClick={isMobile}
          flippingTime={isMobile ? 400 : 800}
          usePortrait={isMobile}
          startZIndex={0}
          autoSize={true}
          clickEventForward={false}
          useMouseEvents={!isMobile}
          swipeDistance={isMobile ? 20 : 50}
          mobileScrollSupport={true}
        >
          {images.map((image, index) => (
            <div
              className="image-page"
              key={index}
              style={{
                backgroundColor: "white",
                border: isMobile ? "none" : "1px solid #e5e7eb",
                borderRadius: isMobile ? "8px" : "0",
                margin: isMobile ? "2px" : "0",
              }}
            >
              <img
                src={image}
                alt={`Página ${index + 1}`}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "contain",
                  display: "block",
                  borderRadius: isMobile ? "8px" : "0",
                }}
              />
              {/* Número da página */}
              <div
                style={{
                  position: "absolute",
                  bottom: isMobile ? "5px" : "10px",
                  right: isMobile ? "5px" : "10px",
                  backgroundColor: "rgba(0,0,0,0.8)",
                  color: "white",
                  padding: isMobile ? "2px 6px" : "4px 8px",
                  borderRadius: isMobile ? "8px" : "12px",
                  fontSize: isMobile ? "10px" : "12px",
                  fontWeight: "500",
                }}
              >
                {index + 1}
              </div>
            </div>
          ))}
        </HTMLFlipBook>
      </div>

      <style jsx>{`
        .flipbook-container {
          display: flex;
          justify-content: center;
          align-items: center;
          width: 100%;
          max-width: 95vw;
          overflow: hidden;
        }

        .flipbook {
          display: block !important;
          margin: 0 auto !important;
        }

        .image-page {
          position: relative;
          background: white;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        }

        @media (max-width: 768px) {
          .flipbook-container {
            padding: 2px;
            max-width: 100vw;
          }

          .flipbook {
            transform: none;
          }
        }

        @media (max-width: 480px) {
          .flipbook-container {
            padding: 1px;
            max-width: 100vw;
          }

          .flipbook {
            transform: none;
          }
        }
      `}</style>
    </div>
  );
}
