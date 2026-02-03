import './ScrollProgress.scss';
export default function ScrollProgress ({ progress }){
  return (
    <div className="scroll-progress-container">
      <div
        className="scroll-progress-bar"
        style={{ width: `${progress}%` }}
      />
      <div className="scroll-progress-text" style={{display: 'none'}}>{progress}%</div>
    </div>
  );
}