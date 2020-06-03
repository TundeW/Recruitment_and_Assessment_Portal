import React from 'react';
import { useTimer } from 'react-timer-hook';

function AssessmentTimer({ expiryTimestamp, expire }) {
  const {
    seconds,
    minutes,
    hours,
    days,
    isRunning,
    start,
    pause,
    resume,
    restart,
    stop,
} = useTimer({ expiryTimestamp, onExpire: () => {
    expire()
    console.warn('onExpire called')} });


  return (
    <div style={{textAlign: 'center'}}>
      <div style={{fontSize: '35px'}}>
        <span>{minutes}</span>min<span>0{seconds}</span>sec<span></span>
      </div>
      {/* <p>{isRunning ? 'Running' : 'Not running'}</p>
      <button onClick={start}>Start</button>
      <button onClick={pause}>Pause</button>
      <button onClick={resume}>Resume</button>
      <button onClick={() => {
        const time = new Date();
        time.setSeconds(time.getSeconds() + 1800);
        restart(time)
      }}>Restart</button> */}

    </div>
  );
}

// export default function App() {
//   const time = new Date();
//   time.setSeconds(time.getSeconds() + 600); // 10 minutes timer
//   return (
//     <div>
//       <MyTimer expiryTimestamp={time} />
//     </div>
//   );
// }
export default AssessmentTimer;
