import Image from "next/image";
import Link from "next/link";

const HeaderBrand = ({
  brandIcon,
  brandIconAlt,
  brandIconSizeWidth = 48,
  brandIconSizeHeight = 48,
  title1,
  title2,
  isH1 = false,
}: {
  brandIcon: string;
  brandIconAlt?: string;
  brandIconSizeWidth?: number;
  brandIconSizeHeight?: number;
  title1: string;
  title2: string;
  isH1?: boolean;
}) => {
  return (
    <div className="flex items-center">
      <div className="me-4">
        <Image
          src={`${brandIcon}`}
          width={128}
          height={128}
          alt={`${brandIconAlt}`}
          style={{
            width: brandIconSizeWidth + "px",
            height: brandIconSizeHeight + "px",
          }}
        />
      </div>
      {isH1 ? (
        <h1>
          <Link href="/">
            <div className="font-bold text-sm lg:text-sm text-gray-800">{title1}</div>
            <div className="text-xs text-gray-600">{title2}</div>
          </Link>
        </h1>
      ) : (
        <div>
          <Link href="/">
            <div className="font-bold text-sm lg:text-sm text-gray-800">{title1}</div>
            <div className="text-xs text-gray-600">{title2}</div>
          </Link>
        </div>
      )}
    </div>
  );
};

export default HeaderBrand;
