import Image from "next/image"

const HeaderContactPart = ({
  contactIcon,
  contactIconAlt,
  contactIconSize = 36,
  title1,
  title2,
}: {
  contactIcon: string
  contactIconAlt?: string
  contactIconSize?: number
  title1: string
  title2: string
}) => {
  return (
    <div className="flex items-center">
      <div className="me-6">
        <Image src={`${contactIcon}`} width={64} height={64} alt={`${contactIconAlt}`} style={{ width: contactIconSize + "px", height: contactIconSize + "px" }} />
      </div>
      <div>
        <div className="font-bold">{title1}</div>
        <div>{title2}</div>
      </div>
    </div>
  )
}

export default HeaderContactPart
