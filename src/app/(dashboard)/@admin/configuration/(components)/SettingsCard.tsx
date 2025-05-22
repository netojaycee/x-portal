import Link from "next/link";
import Image from "next/image";

interface SettingsCardProps {
  title: string;
  iconSrc: string;
  link: string;
}

const SettingsCard: React.FC<SettingsCardProps> = ({
  title,
  iconSrc,
  link,
}) => {
  return (
    <Link href={link}>
      <div className='bg-white rounded-lg shadow-md p-4 flex flex-col items-center justify-center h-32 w-full hover:scale-105 transition-transform duration-200 hover:shadow-lg cursor-pointer'>
        <Image
          src={iconSrc}
          alt={`${title} icon`}
          width={40}
          height={40}
          className='mb-2'
        />
        <h3 className='text-sm font-medium text-gray-800 text-center'>
          {title}
        </h3>
        <p className='text-xs text-blue-600 mt-1 flex items-center'>
          View
          <svg
            className='w-4 h-4 ml-1'
            fill='none'
            stroke='currentColor'
            viewBox='0 0 24 24'
            xmlns='http://www.w3.org/2000/svg'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth='2'
              d='M9 5l7 7-7 7'
            ></path>
          </svg>
        </p>
      </div>
    </Link>
  );
};

export default SettingsCard;
