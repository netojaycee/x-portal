interface ProgressBarProps {
  progress: number; // Percentage (0-100)
}

export default function ProgressBar({ progress }: ProgressBarProps) {
  return (
    <div className='flex-1 relative'>
      {/* Progress Line */}
      <div className='w-full h-1 bg-gray-200 rounded-full'>
        <div
          className='h-1 bg-blue-600 rounded-full transition-all duration-300'
          style={{ width: `${progress}%` }}
        ></div>
      </div>

      {/* Today Marker */}
      {progress > 0 && progress < 100 && (
        <div
          className='absolute top-[-4px] w-2 h-2 bg-blue-600 rounded-full'
          style={{ left: `${progress}%`, transform: "translateX(-50%)" }}
        />
      )}
    </div>
  );
}
