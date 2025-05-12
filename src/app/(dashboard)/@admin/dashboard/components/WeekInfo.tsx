import { Button } from "@/components/ui/button";

interface WeekInfoProps {
  label: string;
  value: string;
}

export default function WeekInfo({ label, value }: WeekInfoProps) {
  return (
    <Button
      variant='outline'
      className='text-sm text-gray-500 border-gray-300 rounded-full px-3 py-1 hover:bg-gray-100'
      disabled
    >
      {label}: {value}
    </Button>
  );
}
