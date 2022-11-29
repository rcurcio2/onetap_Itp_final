import { useParams } from 'react-router-dom';

export default function DevicePour() {
  const { deviceName } = useParams();
  return (
    <div>
      <h1>Device Pour</h1>
      <p>Current Device {deviceName} </p>
    </div>
  );
}