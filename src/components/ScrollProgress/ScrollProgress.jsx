import './ScrollProgress.scss';
export default function ScrollProgress ({ progress = 0}){
  return (
    <div className="scroll-progress-container" style={progress > 0 ? {display: 'block'} : {display: 'none'}}>
      <div
        className="scroll-progress-bar"
        style={{ width: `${progress}%` }}
      />
      <div className="scroll-progress-text" style={{display: 'none'}}>{progress}%</div>
    </div>
  );
}