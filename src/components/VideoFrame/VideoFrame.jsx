/**
 * VideoFrame Component
 *
 * This component creates a scroll-based animation from a series of video frames.
 * It preloads all frames and then uses GSAP ScrollTrigger to animate through them
 * as the user scrolls down the page.
 *
 * @component
 * @param {string} videoPath - Path to the source video (used to determine frames directory)
 * @param {number} totalFrames - Total number of frames to be loaded and displayed (default: 30)
 * @param {string} framesPath - Direct path to the frames directory (overrides videoPath)
 *
 * Features:
 * - Loads all frames at initialization with a loading indicator
 * - Uses canvas for optimal rendering performance
 * - Properly sizes and centers images while maintaining aspect ratio
 * - Handles window resizing events
 * - Supports various input methods for specifying frame locations
 * - Shows scrolling hint for users
 *
 * Usage example:
 * <VideoFrame
 *   videoPath="/videos/animation.mp4"
 *   totalFrames={60}
 * />
 */

import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import './VideoFrame.scss';
// Register the ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

const VideoFrame = ({ videoPath, totalFrames = 30, framesPath = null }) => {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const [imagesLoaded, setImagesLoaded] = useState(0);
  const [images, setImages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const pictureRefs = useRef([]);

  // Function to determine the correct path to frames
  const getFramesPath = () => {
    // If frames path is explicitly provided, use it
    if (framesPath) return framesPath;

    // If no video path is provided, use default path
    if (!videoPath) return '/frames';

    try {
      const pathParts = videoPath.split('/');
      const fileName = pathParts.pop() || '';
      const fileNameWithoutExt = fileName.split('.').slice(0, -1).join('.') || 'frames';
      const framesDir = [...pathParts, fileNameWithoutExt].join('/');
      return framesDir;
    } catch (error) {
      console.error("Error processing videoPath:", error);
      return '/frames'; // Fallback path
    }
  };

  // Function to pad numbers with leading zeros
  function pad(n) {
    return String(n).padStart(3, '0');
  }

  // Load all frame images
  useEffect(() => {
    const path = getFramesPath();
    console.log("Frames path:", path);

    const imagesList = [];

    for (let i = 1; i <= totalFrames; i++) {
      imagesList.push({
        id: i,
        jpg: `${path}/frame_${pad(i)}.jpg`,
        // Optional formats
        // webp: `${path}/frame_${pad(i)}.webp`,
        // avif: `${path}/frame_${pad(i)}.avif`,
      });
    }

    setImages(imagesList);

    // Create an array of refs for each image
    pictureRefs.current = Array(imagesList.length).fill(null).map(() => React.createRef());

  }, [videoPath, totalFrames, framesPath]);

  // Track image loading progress
  useEffect(() => {
    if (images.length === 0) return;

    let loadedCount = 0;
    const imgElements = [];

    // Create all image elements for preloading
    images.forEach((image, index) => {
      const img = new Image();
      img.onload = () => {
        loadedCount++;
        setImagesLoaded(loadedCount);
        if (loadedCount === totalFrames) {
          setIsLoading(false);
          initializeCanvas();
        }
      };
      img.onerror = (e) => {
        console.error(`Error loading image ${image.jpg}:`, e);
        // Increment counter even on error to avoid getting stuck on loading
        loadedCount++;
        setImagesLoaded(loadedCount);
        if (loadedCount === totalFrames) {
          setIsLoading(false);
          initializeCanvas();
        }
      };
      img.src = image.jpg;
      imgElements.push(img);
    });

    return () => {
      // Cleanup when unmounting
      imgElements.forEach(img => {
        img.onload = null;
        img.onerror = null;
      });
    };
  }, [images, totalFrames]);

  // Initialize Canvas and ScrollTrigger
  const initializeCanvas = () => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const container = containerRef.current;

    if (!container || !ctx) return;

    // Function to draw a frame on the canvas
    const drawFrame = (frameIndex) => {
      if (!pictureRefs.current[frameIndex]) return;

      const pictureEl = pictureRefs.current[frameIndex].current;
      if (!pictureEl) return;

      const imgEl = pictureEl.querySelector('img');
      if (!imgEl || !imgEl.complete) return;

      // Clear the canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw the image while maintaining aspect ratio
      const imgRatio = imgEl.naturalWidth / imgEl.naturalHeight;
      const canvasRatio = canvas.width / canvas.height;

      let drawWidth, drawHeight, offsetX, offsetY;

      if (imgRatio > canvasRatio) {
        // Image is wider than canvas relatively
        drawHeight = canvas.height;
        drawWidth = drawHeight * imgRatio;
        offsetX = (canvas.width - drawWidth) / 2;
        offsetY = 0;
      } else {
        // Image is taller than canvas relatively
        drawWidth = canvas.width;
        drawHeight = drawWidth / imgRatio;
        offsetX = 0;
        offsetY = (canvas.height - drawHeight) / 2;
      }

      ctx.drawImage(imgEl, offsetX, offsetY, drawWidth, drawHeight);
    };

    // Set canvas size based on container dimensions
    const setCanvasSize = () => {
      const rect = container.getBoundingClientRect();
      canvas.width = rect.width;
      canvas.height = rect.height;

      // Redraw current frame after resizing
      const currentFrame = Math.floor((totalFrames - 1) / 2); // Middle frame
      drawFrame(currentFrame);
    };

    setCanvasSize();
    window.addEventListener('resize', setCanvasSize);

    // Draw the first frame
    drawFrame(0);

    // Setup ScrollTrigger for scroll-based animation
    const scrollTrigger = ScrollTrigger.create({
      trigger: container,
      start: "top top",
      end: "+=200%",
      pin: true,
      pinSpacing: true,
      scrub: 1,
      onUpdate: (self) => {
        const frameIndex = Math.floor(self.progress * (totalFrames - 1));
        const boundedIndex = Math.max(0, Math.min(frameIndex, totalFrames - 1));
        drawFrame(boundedIndex);
      }
    });

    return () => {
      window.removeEventListener('resize', setCanvasSize);
      if (scrollTrigger) scrollTrigger.kill();
    };
  };

  return (
    <div className="scroll-section" ref={containerRef}>
      <div className="sticky-wrap">
        {/* Canvas for rendering frames */}
        <canvas ref={canvasRef} className="frames-canvas" />

        {/* Picture elements for preloading (hidden) */}
        <div className="hidden-pictures">
          {images.map((image, index) => (
            <picture key={image.id} ref={pictureRefs.current[index]}>
              <img
                src={image.jpg}
                alt={`Frame ${image.id}`}
                className="preload-image"
              />
            </picture>
          ))}
        </div>

        {/* Loading indicator */}
        {isLoading && (
          <div className="loading-overlay">
            <div className="loading-text">Loading frames: {imagesLoaded} / {totalFrames}</div>
            <div className="loading-bar">
              <div
                className="loading-progress"
                style={{ width: `${(imagesLoaded / totalFrames) * 100}%` }}
              ></div>
            </div>
          </div>
        )}

        {/* User hint */}
        <div className="overlay">Scroll to see animation</div>
      </div>
    </div>
  );
};

export default VideoFrame;