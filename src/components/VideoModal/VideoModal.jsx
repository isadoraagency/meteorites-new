import {AnimatePresence, motion} from 'framer-motion'
import './VideoModal.scss'
export default function VideoModal({video, description, source, toggleVideo, isVideo}) {
  return (
    <div>
      <AnimatePresence>
        {
          isVideo && (
            <motion.div
              key="meteorite-video"
              className="video-modal"
              initial={{opacity: 0, scale: 0, borderRadius: 1000}}
              animate={{opacity: 1, scale: 1, borderRadius: 0}}
              exit={{opacity: 0, scale: 0, borderRadius: 1000}}
              transition={{duration: 0.5}}
            >
              <div className="video-modal-in">
                <div className="video-modal__close close" onClick={() => toggleVideo(false)}><i></i></div>
                <div className="ia-container">
                  <div className="video-modal__info">
                    {
                      description && (
                        <div className="video-modal__desc text--info">
                          <p>{description}</p>
                        </div>
                      )
                    }
                    {
                      source && (
                        <div className="video-modal__source">
                          <p className="p2 text-medium text--info"><span className="text-regular">Source:</span> {source}</p>
                        </div>
                      )
                    }
                  </div>

                  <div className="video-modal__video">
                    {
                      video && (
                        <video width="640" height="360" controls autoPlay>
                          <source src={video} type="video/mp4"/>
                          Your browser does not support the video tag.
                        </video>
                      )
                    }
                  </div>

                </div>
              </div>
            </motion.div>
          )
        }
      </AnimatePresence>
    </div>
  )
}
