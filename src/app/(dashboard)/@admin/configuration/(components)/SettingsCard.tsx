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
      <div className='bg-white rounded-lg shadow-md p-4 flex flex-col items-start justify-center h-40 w-full hover:scale-105 transition-transform duration-200 hover:shadow-lg cursor-pointer'>
        <span className='shadow-md shadow-gray-400 rounded-full flex items-center justify-center w-15 h-15 mb-3'>
          <Image
            src={iconSrc}
            alt={`${title} icon`}
            width={20}
            height={20}
            className=''
          />{" "}
        </span>

        <h3 className='text-sm text-gray-800 text-left font-bold font-lato'>
          {title}
        </h3>
        <span className='flex items-center space-x-2 w-full justify-end'>
          <p className='text-sm text-primary flex items-center'>View</p>
          <Image
            src={"/arrow-down-right-01.svg"}
            alt={`${title} icon`}
            width={20}
            height={20}
            className=''
          />
        </span>
      </div>
    </Link>
  );
};

export default SettingsCard;
